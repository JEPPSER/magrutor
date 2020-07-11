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

  searchbar;
  searchresults;

  constructor(private foodService: FoodService, private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.searchbar = this.elementRef.nativeElement.querySelector('#searchbar');
    this.searchresults = this.elementRef.nativeElement.querySelector('#searchresults');
    this.searchbar.addEventListener('ionInput', this.search.bind(this));
  }

  search(event) {
    console.log('hej');
  }
}
