import { Injectable } from '@angular/core';
import { main } from '../../../wailsjs/go/models';
import { GetUserData, SetUserData } from '../../../wailsjs/go/main/App';
import { AddMovieToList, AddTVShowToList } from '../../../wailsjs/go/main/UserData';
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

  public async addTVShowToList(listName: string, tvShow: main.TVShow) {
    await AddTVShowToList(listName, tvShow);
    await this.getUserDataFromBackend();
  }

  public async addMovieToList(listName: string, movie: main.Movie) {
    await AddMovieToList(listName, movie);
    await this.getUserDataFromBackend();
  }

  private async getUserDataFromBackend() {
    const res = await GetUserData();
    console.log('newly fetched userdata', res);
    this.userData.next(res);
  }
}
