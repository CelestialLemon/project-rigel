import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiscoverTVResponse, MediaDetailsResponse } from './tmdb.models';
import { TMDB_API_BASE_URL, TMDB_API_KEY } from './constants';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  constructor(private http: HttpClient) {}

  async getDiscoverShows() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${TMDB_API_KEY}`,
      'accept' : 'application/json'
    });

    const res = await lastValueFrom(this.http.get<DiscoverTVResponse>(TMDB_API_BASE_URL + '/discover/tv?include_adult=true&include_null_first_air_dates=true&page=1&sort_by=popularity.desc&with_genres=10765', { headers }));

    return res.results;
  }

  async getMediaDetails(mediaId: number): Promise<MediaDetailsResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${TMDB_API_KEY}`,
      'accept': `application/json`
    });

    const res = await lastValueFrom(this.http.get<MediaDetailsResponse>(TMDB_API_BASE_URL + `/tv/${mediaId}?language=en-US`, { headers }));

    return res;
  }

}