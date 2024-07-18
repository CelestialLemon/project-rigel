import { Injectable, signal } from '@angular/core';
import { ReadData, } from '../../../wailsjs/go/main/App'
import { main } from '../../../wailsjs/go/models';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ListsService {

  lists = signal<main.WatchList[]>([]);

  constructor() {
    this.readData();
  }

  private async readData() {
    const res = await ReadData();
    this.lists.set(res);
  }
}
