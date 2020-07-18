export class Day {
  entries: [any, number][] = [];
  date: Date;
  calories: number = 0;
  id: number;

  constructor(date) {
    this.date = date;
  }
}