import { Injectable } from '@angular/core';
import { main } from '../../../wailsjs/go/models';
import { GetUserData, SetUserData } from '../../../wailsjs/go/main/App';
import { AddMovieToList, AddTVShowToList, MoveMovieToList, MoveTVShowToList, RemoveMovieFromList, RemoveTVShowFromList } from '../../../wailsjs/go/main/UserData';
import { BehaviorSubject } from 'rxjs';
import { MVWatchStatus, TVWatchStatus } from '../tmdb.models';

// lists that correspond to some status

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

  /** Get the lastest value of user data */
  public getUserData(): main.UserData {
    return this.userData.getValue();
  }

  /** Set new value to the user data */
  public updateUserData(newUserData: main.UserData) {
    this.userData.next(newUserData);
    SetUserData(newUserData);
  }

  /** Adds the given show item to given listname */
  public async addTVShowToList(listName: string, tvShow: main.TVShow) {
    await AddTVShowToList(listName, tvShow);
    await this.getUserDataFromBackend();
  }

  /** Adds the given movie item to the given listname */
  public async addMovieToList(listName: string, movie: main.Movie) {
    await AddMovieToList(listName, movie);
    await this.getUserDataFromBackend();
  }

  public async moveMovieToList(
    previousListName: string,
    newListName: string,
    movie: main.Movie
  ) {
    await MoveMovieToList(previousListName, newListName, movie);
    await this.getUserDataFromBackend();
  }

  /** Gets the status of the movie given its id */
  //  * Loop through all possible statuses
  //  * Find the watch list that corresponds to that status
  //  * Check if the item with given id is present in the list
  //  * Assign status new value (status corresponding to that list)
  //  * return result
  public getMovieStatus(id: string): MVWatchStatus {
    let status = MVWatchStatus.UNWATCHED;
    if (id === '') return status;

    const userData = this.userData.getValue();

    Object.entries(MVWatchStatus).forEach(([key, value]) => {
      const list = userData.mvlists.find((list) => list.name === value);
      if (list == null) return;
      list.items.forEach((item) => {
        if (item.id === id) status = value;
      });
    });
    return status;
  }

  /** Gets the status of the show given its id */
  public getTVShowStatus(id: string): TVWatchStatus {
    let status = TVWatchStatus.UNWATCHED;
    if (id === '') return status;

    const userData = this.userData.getValue();

    /**
     * Loop through all possible statuses
     * Find the watch list that corresponds to that status
     * Check if the item with given id is present in the list
     * Assign status new value (status corresponding to that list)
     * return result
     */
    Object.entries(TVWatchStatus).forEach(([key, value]) => {
      const list = userData.tvlists.find((list) => list.name === value);
      if (list == null) return;
      list.items.forEach((item) => {
        if (item.id === id) status = value;
      });
    });
    return status;
  }

  /** Fetches the latest user data from backend */
  private async getUserDataFromBackend() {
    const res = await GetUserData();
    console.log('newly fetched userdata', res);
    this.userData.next(res);
  }
}
