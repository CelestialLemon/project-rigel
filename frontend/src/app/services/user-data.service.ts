import { Injectable } from '@angular/core';
import { main } from '../../../wailsjs/go/models';
import { GetUserData, SetUserData } from '../../../wailsjs/go/main/App';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  readonly userData = new BehaviorSubject<main.UserData>(
    new main.UserData({ mvlists: [], tvlists: [] })
  );
  constructor() {
    this.getUserDataFromBackend();
  }

  public getUserData(): main.UserData {
    return this.userData.getValue();
  }

  public updateUserData(newUserData: main.UserData) {
    this.userData.next(newUserData);
    SetUserData(newUserData);
  }

  private async getUserDataFromBackend() {
    const res = await GetUserData();
    this.userData.next(res);
  }
}
