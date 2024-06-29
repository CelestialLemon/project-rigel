import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DiscoverTVResponse, MediaTVDetailsResponse, MediaCreditsResponse, MediaTVImagesResponse, MediaTVSeasonResponse, MediaTVVideosResponse, MediaMVDetailsResponse } from './tmdb.models';
import { TMDB_API_BASE_URL, TMDB_API_KEY } from './constants';
import { lastValueFrom } from 'rxjs';
import { MediaType } from './pages/media-details/media-details.component';

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

  async getMediaDetails(mediaId: string, mediaType: MediaType)
  : Promise<MediaTVDetailsResponse | MediaMVDetailsResponse> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${TMDB_API_KEY}`,
      'accept': `application/json`
    });

    const res = await lastValueFrom(this.http.get<MediaTVDetailsResponse | MediaMVDetailsResponse>(TMDB_API_BASE_URL + `/${mediaType}/${mediaId}?language=en-US`, { headers }));

    return res;
  }


  async getMediaTVSeasonDetails(mediaId: string, seasonNumber: number = 1) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${TMDB_API_KEY}`,
      'accept': `application/json`
    });

    const res = await lastValueFrom(this.http.get<MediaTVSeasonResponse>(TMDB_API_BASE_URL + `/tv/${mediaId}/season/${seasonNumber}?language=en-US`, { headers }));

    return res;
  }

  async getMediaCreditsDetails(mediaId: string, mediaType: MediaType) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${TMDB_API_KEY}`,
      'accept': `application/json`
    });

    const res = await lastValueFrom(this.http.get<MediaCreditsResponse>(TMDB_API_BASE_URL + `/${mediaType}/${mediaId}/credits?language=en-US`, { headers }));

    return res;
  }

  async getMediaTVImagesDetails(mediaId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${TMDB_API_KEY}`,
      'accept': `application/json`
    });

    const res = await lastValueFrom(this.http.get<MediaTVImagesResponse>(TMDB_API_BASE_URL + `/tv/${mediaId}/images`, { headers }));

    return res;
  }

  async getMediaTVVideosDetails(mediaId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${TMDB_API_KEY}`,
      'accept': `application/json`
    });

    const res = await lastValueFrom(this.http.get<MediaTVVideosResponse>(TMDB_API_BASE_URL + `/tv/${mediaId}/videos`, { headers }));

    return res;
  }
}
