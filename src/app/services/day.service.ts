import { Injectable } from '@angular/core';
import { Day } from '../model/day';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DayService {

  public days: Day[] = [];
  private DAYS_STORAGE: string = 'days';

  constructor() { }

  getDay(id: number) {
    for (let i = 0; i < this.days.length; i++) {
      if (this.days[i].id == id) {
        return this.days[i];
      }
    }
    return null;
  }

  addNewDay() {
    let day: Day = new Day(new Date().toISOString());

    // Generate a unique ID for the day.
    let id = this.days.length - 1;
    let done = false;
    while (!done) {
      done = true;
      id++;
      for (let i = 0; i < this.days.length; i++) {
        if (this.days[i].id == id) {
          done = false;
          break;
        }
      }
    }
    day.id = id;

    this.days.unshift(day);
    this.updateStorage();
    return day;
  }

  updateDay(day: Day) {
    for (let i = 0; i < this.days.length; i++) {
      if (this.days[i].id == day.id) {
        this.days[i] = day;
        break;
      }
    }
    this.updateStorage();
  }

  private updateStorage() {
    Storage.set({
      key: this.DAYS_STORAGE,
      value: JSON.stringify(this.days)
    });
  }

  async loadSaved() {
    const days = await Storage.get({ key: this.DAYS_STORAGE });
    this.days = JSON.parse(days.value) || [];
    let temp = this.days;
    return new Promise(function(resolve, reject) {
      resolve(temp);
    });
  }
}
