import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('/assets/data/nutrient-data.json').subscribe((response) => {
      console.log(response);
  });
  }

}
