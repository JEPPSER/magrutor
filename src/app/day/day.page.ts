import { Component, ElementRef } from '@angular/core';
import { FoodService } from '../services/food.service';
import { AlertController } from '@ionic/angular';
import { Day } from '../model/day';
import { Router, ActivatedRoute } from '@angular/router';
import { DayService } from '../services/day.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-day',
  templateUrl: './day.page.html',
  styleUrls: ['./day.page.scss'],
})
export class DayPage {

  readonly MAX_SEARCH_RESULT = 50;

  calText;
  svg;
  searchbar;
  day: Day;
  date: Date;
  dateTime;

  constructor(private router: Router, public dayService: DayService, private alertController: AlertController, private foodService: FoodService, private elementRef: ElementRef, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.day = this.dayService.getDay(params.day);
      this.date = this.day.date;
    });
  }

  ngAfterViewInit() {
    this.dateTime = this.elementRef.nativeElement.querySelector('#dateTime');
    this.dateTime.addEventListener('ionChange', () => {
      this.day.date = this.date;
      this.dayService.updateDay(this.day);
    });

    this.calText = this.elementRef.nativeElement.querySelector('#calText');
    this.buildPiechart();

    this.searchbar = this.elementRef.nativeElement.querySelector('#searchbar');
    this.searchbar.addEventListener('ionInput', this.search.bind(this));

    for (let i = 0; i < this.day.entries.length; i++) {
      let entry = this.day.entries[i];
      this.addFoodEntryElement(entry);
    }
  }

  addFood() {
    this.router.navigate(['/food']);
  }

  buildPiechart() {
    d3.selectAll('svg > *').remove();
    this.svg = d3.select('#piechart')
      .attr('width', 300)
      .attr('height', 100)
      .append('g')
      .attr('transform', 'translate(50, 50)');

    let calories = 0;
    let data = { Protein: 0, Fett: 0, Kolhydrater: 0 };
    for (let i = 0; i < this.day.entries.length; i++) {
      let entry = this.day.entries[i];
      calories += entry[0]['Energi (kcal)'] * (entry[1] / 100);
      data.Protein += entry[0]['Protein (g)'] * (entry[1] / 100);
      data.Fett += entry[0]['Fett (g)'] * (entry[1] / 100);
      data.Kolhydrater += entry[0]['Kolhydrater (g)'] * (entry[1] / 100);
    }

    this.day.calories = calories;
    this.dayService.updateDay(this.day);
    this.calText.innerText = Math.round(calories) + ' kcal';

    var color = d3.scaleOrdinal()
      .domain(data)
      .range(["#ff0000", "#00ff00", "#0000ff"]);

    var pie = d3.pie().value(function (d) { return d.value; });
    var data_ready = pie(d3.entries(data));

    this.svg
      .selectAll('whatever')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(0)
        .outerRadius(40)
      )
      .attr('fill', function (d) { return (color(d.data.key)) })
      .attr("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", 0.7);

    let legend = this.svg.selectAll('.legend')
      .data(data_ready)
      .enter().append("g")
      .attr("transform", function (d, i) {
        return 'translate(60, ' + (i * 20 - 30) + ')';
      })
      .attr("class", "legend");

    legend.append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", function (d) {
        return color(d.data.key);
      });

    legend.append("text")
      .text(function (d) {
        return d.data.key + ': ' + Math.round(d.data.value) + ' g';
      })
      .style("font-size", 12)
      .attr("y", 10)
      .attr("x", 14);
  }

  addFoodEntryElement(entry: [any, number]) {
    let intake = document.querySelector('#intake');
    let item = document.createElement('ion-item');

    let btn = document.createElement('ion-button');
    btn.setAttribute('style', 'padding-right: 5px');
    btn.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
    item.appendChild(btn);

    let calories = entry[0]['Energi (kcal)'] * (entry[1] / 100);
    let str = entry[0].Livsmedelsnamn + ': ' + entry[1] + 'g (' + Math.round(calories) + ' kcal)';
    item.append(str);

    intake.appendChild(item);

    btn.addEventListener('click', () => {

      // Storage
      this.day.entries.splice(this.day.entries.indexOf(entry), 1);
      this.dayService.updateDay(this.day);

      // UI
      intake.removeChild(item);
      this.buildPiechart();
    });
  }

  addFoodEntry(food, weight) {
    if (weight == '' || weight < 0) { return }

    let entry: [any, number] = [food, weight];

    // Storage
    this.day.entries.unshift(entry);
    this.dayService.updateDay(this.day);

    // UI
    this.addFoodEntryElement(entry);
    this.searchbar.value = '';
    this.search(null);

    // Update piechart
    this.buildPiechart();
  }

  async removeDay() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Vill du ta bort denna dagen?',
      buttons: [
        {
          text: 'Ja',
          handler: () => {
            this.dayService.removeDay(this.day);
            this.router.navigate(['/']);
          }
        },
        {
          text: 'Nej'
        }
      ]
    });

    await alert.present();
  }

  async weightAlert(food) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      message: 'Vikt i gram:',
      inputs: [
        {
          name: 'weight',
          type: 'number',
        }
      ],
      buttons: [
        {
          text: 'OK',
          handler: (alertData) => {
            this.addFoodEntry(food, alertData.weight);
          }
        },
        {
          text: 'Avbryt'
        }
      ]
    });

    await alert.present();
  }

  search(event) {
    let searchresults = document.querySelector('#searchresults');
    const query = this.searchbar.value.toLowerCase();

    // Clear list.
    while (searchresults.children.length > 0) {
      searchresults.removeChild(searchresults.children[0]);
    }

    requestAnimationFrame(() => {
      let count = 0;

      for (let i = 0; i < this.foodService.foods.length; i++) {
        let food = this.foodService.foods[i];

        if (food.Livsmedelsnamn.toLowerCase().includes(query) && query.length > 0) {
          let item = document.createElement('ion-item');
          item.innerText = food.Livsmedelsnamn;
          item.button = true;
          item.addEventListener('click', () => {
            this.weightAlert(food);
          });
          searchresults.appendChild(item);
          item.setAttribute('style', '--ion-item-background:#eef;');
          count++;
        }

        if (count > this.MAX_SEARCH_RESULT) { break; }
      }
    });
  }
}
