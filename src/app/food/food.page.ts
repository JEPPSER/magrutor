import { Component, OnInit } from '@angular/core';
import { FoodService } from '../services/food.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-food',
  templateUrl: './food.page.html',
  styleUrls: ['./food.page.scss'],
})
export class FoodPage implements OnInit {

  name;
  protein;
  fat;
  carbs;
  calories;

  foods;

  constructor(private foodService: FoodService, private alertController: AlertController) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadLocalFoods();
  }

  loadLocalFoods() {
    this.foods = document.querySelector('#foods');
    
    // Clear list.
    while (this.foods.children.length > 0) {
      this.foods.removeChild(this.foods.children[0]);
    }

    for (let i = 0; i < this.foodService.localFoods.length; i++) {
      this.addFoodElement(this.foodService.localFoods[i]);
    }
  }

  addFoodElement(food) {
    let item = document.createElement('ion-item');
    item.innerText = food.Livsmedelsnamn;
    let btn = document.createElement('ion-button');
    btn.setAttribute('style', 'padding-left: 5px');
    btn.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
    item.appendChild(btn);
    this.foods.appendChild(item);

    btn.addEventListener('click', () => {
      let index = Array.prototype.indexOf.call(this.foods.children, item);
      this.removeAlert(this.foodService.localFoods[index], item);
    });
  }

  async removeAlert(food, item) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Ta bort?',
      message: '<h3>' + food['Livsmedelsnamn'] + '</h3>Protein: ' + food['Protein (g)'] + '<br>Fett: ' + food['Fett (g)'] + '<br>Kolhydrater: ' + food['Kolhydrater (g)'] + '<br>Kalorier: ' + food['Energi (kcal)'],
      buttons: [
        {
          text: 'Ja',
          handler: () => {
            this.foodService.removeLocalFood(food);
            this.loadLocalFoods();
          }
        },
        {
          text: 'Nej'
        }
      ]
    });

    await alert.present();
  }

  addFood() {
    if (this.name == undefined ||
        this.name == "" ||
        this.protein == undefined ||
        this.fat == undefined ||
        this.carbs == undefined ||
        this.calories == undefined) {
      return;
    }

    let food = {};
    food['Livsmedelsnamn'] = this.name;
    food['Protein (g)'] = this.protein;
    food['Fett (g)'] = this.fat;
    food['Kolhydrater (g)'] = this.carbs;
    food['Energi (kcal)'] = this.calories;
    this.addAlert(food);
  }

  async addAlert(food) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Lägg till?',
      message: '<h3>' + this.name + '</h3>Protein: ' + this.protein + '<br>Fett: ' + this.fat + '<br>Kolhydrater: ' + this.carbs + '<br>Kalorier: ' + this.calories,
      buttons: [
        {
          text: 'Ja',
          handler: () => {
            this.foodService.addLocalFood(food);
            this.loadLocalFoods();
          }
        },
        {
          text: 'Nej'
        }
      ]
    });

    await alert.present();
  }
}
