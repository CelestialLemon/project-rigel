import { effect, Injectable, signal } from '@angular/core';
import { ReadData, WriteData, Greet, SaveData} from '../../../wailsjs/go/main/App'
import { main } from '../../../wailsjs/go/models';
import * as runtime from '../../../wailsjs/runtime/runtime';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  lists: main.WatchList[] = [];

  constructor() {
    this.readData();
    runtime.EventsOn('before-close', () => {
      this.saveDataAndQuit();
    });
  }

  private async readData() {
    const res = await ReadData();
    this.lists = res;
  }

  private saveDataAndQuit() {
    WriteData(this.lists);
    runtime.Quit();
  }
}

const areListsEqual = (a: main.WatchList[], b: main.WatchList[]): boolean => {
  // TODO: maybe improved later
  return JSON.stringify(a) === JSON.stringify(b);
}

