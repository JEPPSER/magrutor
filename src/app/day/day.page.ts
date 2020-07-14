import { Component, ElementRef } from '@angular/core';
import { FoodService } from '../food.service';

@Component({
  selector: 'app-day',
  templateUrl: './day.page.html',
  styleUrls: ['./day.page.scss'],
})
export class DayPage {

  readonly MAX_SEARCH_RESULT = 50;

  searchbar;
  date: String = new Date().toISOString();

  constructor(private foodService: FoodService, private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.searchbar = this.elementRef.nativeElement.querySelector('#searchbar');
    this.searchbar.addEventListener('ionInput', this.search.bind(this));
  }

  save() {
    console.log('save');
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
          item.addEventListener('click', function() {
            console.log(food);
          });
          searchresults.appendChild(item);
          count++;
        }

        if (count > this.MAX_SEARCH_RESULT) { break; }
      }
    });
  }
}
