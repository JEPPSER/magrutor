import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  private FOODS_STORAGE: string = 'foods';

  foods: any[];
  localFoods: any[];

  constructor(private http: HttpClient) {
    this.http.get('/assets/data/nutrient-data.json').subscribe((response) => {
      this.foods = <any[]>response;
      this.loadLocalFoods();
    });
  }

  async loadLocalFoods() {
    const str = await Storage.get({ key: this.FOODS_STORAGE });
    this.localFoods = JSON.parse(str.value);
    
    if (this.localFoods == null) { 
      this.localFoods = [];
      return;
    }

    for (let i = 0; i < this.localFoods.length; i++) {
      this.foods.unshift(this.localFoods[i]);
    }
  }

  addLocalFood(food) {
    this.foods.unshift(food);
    this.localFoods.unshift(food);
    Storage.set({
      key: this.FOODS_STORAGE,
      value: JSON.stringify(this.localFoods)
    });
  }

  removeLocalFood(food) {
    if (this.foods.includes(food)) {
      this.foods.splice(this.foods.indexOf(food), 1);
    }

    if (this.localFoods.includes(food)) {
      this.localFoods.splice(this.localFoods.indexOf(food), 1);
    }

    Storage.set({
      key: this.FOODS_STORAGE,
      value: JSON.stringify(this.localFoods)
    });
  }
}
