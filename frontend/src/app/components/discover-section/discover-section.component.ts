import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_IMAGE_BASE_URL } from '../../constants';
import { DiscoverTVEntry, DiscoverTVResponse } from '../../tmdb.models';
import { lastValueFrom } from 'rxjs';
import { clamp } from '../../utilities/utilities';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discover-section',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './discover-section.component.html',
  styleUrl: './discover-section.component.scss'
})
export class DiscoverSectionComponent {

  protected discoverShows: DiscoverTVEntry[] = [];

  protected selectedItemIndex: number = 0;

  protected selectedItem: DiscoverTVEntry | null = null;

  constructor(private http: HttpClient, private router: Router) {}


  ngOnInit(): void {
    this.makeRequest();
  }

  async makeRequest() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${TMDB_API_KEY}`,
      'accept' : 'application/json'
    });

    const res = await lastValueFrom(this.http.get<DiscoverTVResponse>(TMDB_API_BASE_URL + '/discover/tv?include_adult=true&include_null_first_air_dates=true&page=1&sort_by=popularity.desc&with_genres=10765', { headers }));

    this.discoverShows = res.results;
    this.selectedItem = this.discoverShows[this.selectedItemIndex];
    console.log(this.selectedItem);
  }

  protected onClickScrollLeft(): void {
    this.selectedItemIndex = clamp(this.selectedItemIndex - 1, 0, this.discoverShows.length - 1);
    this.selectedItem = this.discoverShows[this.selectedItemIndex];
  }

  protected onClickScrollRight(): void {
    this.selectedItemIndex = clamp(this.selectedItemIndex + 1, 0, this.discoverShows.length - 1);
    this.selectedItem = this.discoverShows[this.selectedItemIndex];
  }

  protected get backdroImageUrl(): string {
    if (this.selectedItem == null) return '';
    if (this.selectedItem.backdrop_path == null) return '';
    else return TMDB_IMAGE_BASE_URL + this.selectedItem.backdrop_path;
  }

  protected onClickMediaInfo(): void {
    this.router.navigate(['/media-details']);
  }
}
