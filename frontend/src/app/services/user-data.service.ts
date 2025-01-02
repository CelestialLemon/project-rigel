import { Injectable } from '@angular/core';
import { main } from '../../../wailsjs/go/models';
import {
	GetUserData,
	SaveUserData,
	SetUserData,
} from '../../../wailsjs/go/main/App';
import {
	UpdateMovieWatchStatus,
	UpdateTVShowWatchStatus,
	GetMovieWatchStatus,
	GetTVShowWatchStatus,
	GetMoviesStatusLists,
	GetTVShowsStatusLists,
	GetCustomMoviesLists,
	GetCustomTVShowsLists,
	UpdateTVShowEpisodeWatchStatus
} from '../../../wailsjs/go/main/UserData';
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

	public async updateMovieWatchStatus(
		movie: main.Movie,
		newWatchStatus: MVWatchStatus
	) {
		await UpdateMovieWatchStatus(movie, newWatchStatus);
		await this.getUserDataFromBackend();
	}

	public async updateTVShowWatchStatus(
		tvShow: main.TVShow,
		newWatchStatus: TVWatchStatus
	) {
		await UpdateTVShowWatchStatus(tvShow, newWatchStatus);
		await this.getUserDataFromBackend();
	}

	public async getMovieWatchStatus(movieId: number) {
		return await GetMovieWatchStatus(movieId);
	}

	public async getTVShowWatchStatus(tvShowId: number) {
		return await GetTVShowWatchStatus(tvShowId);
		this.userData.getValue();
	}

	public async getMoviesStatusLists() {
		return await GetMoviesStatusLists();
	}

	public async getTVShowsStatusLists() {
		return await GetTVShowsStatusLists();
	}

	public async getCustomMoviesLists() {
		return await GetCustomMoviesLists();
	}

	public async getCustomTVShowsLists() {
		return await GetCustomTVShowsLists();
	}

	public getWatchedEpisodesData(showId: number): { [key: number]: number } {
		return this.userData.getValue().tv_shows[showId]?.watched_episodes ?? {};
	}


	public async setEpisodeWatchStatus(tvShow: main.TVShow, season: number, episode: number) {
		await UpdateTVShowEpisodeWatchStatus(tvShow, season, episode);
		await this.getUserDataFromBackend();
	}
	/** Fetches the latest user data from backend */
	private async getUserDataFromBackend() {
		const res = await GetUserData();
		console.log('newly fetched userdata', res);
		this.userData.next(res);
	}
}
