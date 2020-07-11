import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  foods;

  constructor(private http: HttpClient) {
    this.http.get('/assets/data/nutrient-data.json').subscribe((response) => {
      this.foods = response;
    });
  }
}
