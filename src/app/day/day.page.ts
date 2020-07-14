import { Component, ElementRef, ErrorHandler } from '@angular/core';
import { FoodService } from '../food.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-day',
  templateUrl: './day.page.html',
  styleUrls: ['./day.page.scss'],
})
export class DayPage {

  readonly MAX_SEARCH_RESULT = 50;

  searchbar;
  date: String = new Date().toISOString();

  constructor(private alertController: AlertController, private foodService: FoodService, private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.searchbar = this.elementRef.nativeElement.querySelector('#searchbar');
    this.searchbar.addEventListener('ionInput', this.search.bind(this));
  }

  save() {
    console.log('save');
  }
  
  addFood(food, weight) {
    if (weight == '' || weight < 0) { return }
    console.log(food.Livsmedelsnamn + ': ' + weight);
    let intake = document.querySelector('#intake');
    let item = document.createElement('ion-item');
    item.innerText = food.Livsmedelsnamn + ': ' + weight + 'g';
    intake.appendChild(item);
    this.searchbar.value = '';
    this.search(null);
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
            this.addFood(food, alertData.weight);
          }
        },
        {
          text: 'Cancel'
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
          item.setAttribute('style', '--ion-item-background:#eee;');
          count++;
        }

        if (count > this.MAX_SEARCH_RESULT) { break; }
      }
    });
  }
}
