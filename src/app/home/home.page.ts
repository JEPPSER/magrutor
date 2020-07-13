import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  daysList;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.daysList = document.querySelector('#daysList');
  }

  addDay() {
    this.router.navigate(['/day']);
  }
}
