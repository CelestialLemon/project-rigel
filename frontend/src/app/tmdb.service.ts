import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	TVSearchResponse,
	MediaTVDetailsResponse,
	MediaCreditsResponse,
	MediaTVImagesResponse,
	MediaTVSeasonResponse,
	MediaTVVideosResponse,
	MediaMVDetailsResponse,
	MVSearchResponse,
	GenreResponse,
} from './tmdb.models';
import { TMDB_API_BASE_URL, TMDB_API_KEY } from './constants';
import { lastValueFrom } from 'rxjs';
import { MediaType } from './tmdb.models';

@Injectable({
	providedIn: 'root',
})
export class TmdbService {
	constructor(private http: HttpClient) {}

	async getDiscoverMedia(mediaType: MediaType) {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${TMDB_API_KEY}`,
			accept: 'application/json',
		});

		const res = await lastValueFrom(
			this.http.get<TVSearchResponse | MVSearchResponse>(
				TMDB_API_BASE_URL +
					`/discover/${mediaType}?include_adult=true&include_null_first_air_dates=true&page=1&sort_by=popularity.desc`,
				{ headers }
			)
		);

		return res.results;
	}

	async getMediaDetails(
		mediaId: number,
		mediaType: MediaType
	): Promise<MediaTVDetailsResponse | MediaMVDetailsResponse> {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${TMDB_API_KEY}`,
			accept: `application/json`,
		});

		const res = await lastValueFrom(
			this.http.get<MediaTVDetailsResponse | MediaMVDetailsResponse>(
				TMDB_API_BASE_URL + `/${mediaType}/${mediaId}?language=en-US`,
				{ headers }
			)
		);

		return res;
	}

	async getMediaTVSeasonDetails(mediaId: number, seasonNumber: number = 1) {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${TMDB_API_KEY}`,
			accept: `application/json`,
		});

		const res = await lastValueFrom(
			this.http.get<MediaTVSeasonResponse>(
				TMDB_API_BASE_URL +
					`/tv/${mediaId}/season/${seasonNumber}?language=en-US`,
				{ headers }
			)
		);

		return res;
	}

	async getMediaCreditsDetails(mediaId: number, mediaType: MediaType) {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${TMDB_API_KEY}`,
			accept: `application/json`,
		});

		const res = await lastValueFrom(
			this.http.get<MediaCreditsResponse>(
				TMDB_API_BASE_URL +
					`/${mediaType}/${mediaId}/credits?language=en-US`,
				{ headers }
			)
		);

		return res;
	}

	async getMediaImagesDetails(mediaId: number, mediaType: MediaType) {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${TMDB_API_KEY}`,
			accept: `application/json`,
		});

		const res = await lastValueFrom(
			this.http.get<MediaTVImagesResponse>(
				TMDB_API_BASE_URL + `/${mediaType}/${mediaId}/images`,
				{ headers }
			)
		);

		return res;
	}

	async getMediaVideosDetails(mediaId: number, mediaType: MediaType) {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${TMDB_API_KEY}`,
			accept: `application/json`,
		});

		const res = await lastValueFrom(
			this.http.get<MediaTVVideosResponse>(
				TMDB_API_BASE_URL + `/${mediaType}/${mediaId}/videos`,
				{ headers }
			)
		);

		return res;
	}

	async searchMedia(query: string, mediaType: MediaType) {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${TMDB_API_KEY}`,
			accept: `application/json`,
		});

		const baseParams = new HttpParams();

		const res = await lastValueFrom(
			this.http.get<TVSearchResponse | MVSearchResponse>(
				TMDB_API_BASE_URL + `/search/${mediaType}`,
				{
					headers,
					params: baseParams.set('query', query),
				}
			)
		);

		return res.results;
	}

	async getGenres(mediaType: MediaType) {
		const headers = new HttpHeaders({
			Authorization: `Bearer ${TMDB_API_KEY}`,
			accept: `application/json`,
		});

		const res = await lastValueFrom(
			this.http.get<GenreResponse>(
				TMDB_API_BASE_URL + `/genre/${mediaType}/list`,
				{
					headers,
				}
			)
		);

		return res.genres;
	}
}
