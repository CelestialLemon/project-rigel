import { effect, Injectable, signal } from '@angular/core';
import { ReadData, WriteDataAndQuit, Greet } from '../../../wailsjs/go/main/App'
import { main } from '../../../wailsjs/go/models';
import * as runtime from '../../../wailsjs/runtime/runtime';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  // main subject that contains all data
  readonly lists = new BehaviorSubject<main.WatchList[]>([]);

  constructor() {
    // read data from disk on boot
    this.readData();

    // write the latest data to disk and close
    runtime.EventsOn('before-close', () => {
      WriteDataAndQuit(this.lists.getValue());
    });
  }

  private async readData() {
    const res = await ReadData();
    this.lists.next(res);
  }
}

