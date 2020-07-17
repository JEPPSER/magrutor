import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Day } from '../model/day';
import { DayService } from '../services/day.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  daysList;
  days;

  constructor(private router: Router, public dayService: DayService) {
  }

  ngOnInit() {
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.loadDays();
  }

  ngAfterViewInit() {
    this.daysList = document.querySelector('#daysList');
    this.loadDays();
  }

  async loadDays() {
    // Clear days.
    while (this.daysList.children.length > 0) {
      this.daysList.removeChild(this.daysList.children[0]);
    }

    let days;
    await this.dayService.loadSaved().then((value) => {
      days = value;
    });

    for (let i = 0; i < days.length; i++) {
      let day = days[i];
      let item = document.createElement('ion-item');
      item.innerText = day.date + " [" + day.id + "]";
      item.button = true;
      item.addEventListener('click', () => {
        this.router.navigate(['/day'], { queryParams: {day: day.id }});
      });
      this.daysList.appendChild(item);
    }
  }

  addDay() {
    // TODO: save day to storage.
    let day: Day = this.dayService.addNewDay();
    this.router.navigate(['/day'], { queryParams: { day: day.id } });
  }
}
