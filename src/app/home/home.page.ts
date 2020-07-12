import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { FoodService } from '../food.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  readonly MAX_SEARCH_RESULT = 100;

  searchbar;

  constructor(private foodService: FoodService, private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.searchbar = this.elementRef.nativeElement.querySelector('#searchbar');
    this.searchbar.addEventListener('ionInput', this.search.bind(this));
  }

  search(event) {
    const items = Array.from(document.querySelector('#searchresults').children);
    const query = this.searchbar.value.toLowerCase();

    requestAnimationFrame(() => {
      let count = 0;

      for (let i = 0; i < items.length; i++) {
        let item = <HTMLElement>items[i];

        if (item.textContent.toLowerCase().includes(query) && query.length > 0) {
          item.style.display = 'block';
          count++;
        } else {
          item.style.display = 'none';
        }

        if (count > this.MAX_SEARCH_RESULT) { break; }
      }
    });
  }
}
