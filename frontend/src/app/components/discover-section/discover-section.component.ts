import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  TMDB_API_KEY,
  TMDB_API_BASE_URL,
  TMDB_IMAGE_ORIGINAL_BASE_URL,
} from '../../constants';
import {
  MVEntry,
  SearchEntry,
  TVEntry,
  TVSearchResponse,
} from '../../tmdb.models';
import { lastValueFrom } from 'rxjs';
import { clamp } from '../../utilities/utilities';
import { TmdbService } from '../../tmdb.service';
import { MatIconModule } from '@angular/material/icon';
import { MediaType } from '../../pages/media-details/media-details.component';

@Component({
  selector: 'app-discover-section',
  standalone: true,
  imports: [MatIconModule],
  providers: [TmdbService],
  templateUrl: './discover-section.component.html',
  styleUrl: './discover-section.component.scss',
})
export class DiscoverSectionComponent {
  /** Emitted when user clicks on the media info of any entry */
  @Output('clickMediaEntry') clickOnSearchEntry: EventEmitter<SearchEntry> =
    new EventEmitter<SearchEntry>();

  protected discoverTV: TVEntry[] = [];
  protected discoverMV: MVEntry[] = [];

  protected discoverItems: SearchEntry[] = [];

  protected selectedItemIndex: number = 0;

  protected selectedItem: SearchEntry | null = null;

  constructor(private tmdbService: TmdbService) {}

  async ngOnInit() {
    this.discoverTV = (await this.tmdbService.getDiscoverMedia(
      MediaType.TV
    )) as TVEntry[];
    this.discoverMV = (await this.tmdbService.getDiscoverMedia(
      MediaType.MOVIE
    )) as MVEntry[];

    this.discoverItems = this.discoverItems
      .concat(
        this.discoverTV.slice(0, 5).map((tvItem): SearchEntry => {
          return {
            title: tvItem.name,
            overview: tvItem.overview,
            backdrop_path: tvItem.backdrop_path,
            type: MediaType.TV,
            mediaId: tvItem.id,
            poster_path: null,
            date: null,
            genres: null
          };
        })
      )
      .concat(
        this.discoverMV.slice(0, 5).map((mvItem): SearchEntry => {
          return {
            title: mvItem.title,
            overview: mvItem.overview,
            backdrop_path: mvItem.backdrop_path,
            type: MediaType.MOVIE,
            mediaId: mvItem.id,
            poster_path: null,
            date: null,
            genres: null
          };
        })
      );

    this.selectedItem = this.discoverItems[this.selectedItemIndex];
  }

  protected onClickScrollLeft(): void {
    this.selectedItemIndex = clamp(
      this.selectedItemIndex - 1,
      0,
      this.discoverItems.length - 1
    );
    this.selectedItem = this.discoverItems[this.selectedItemIndex];
  }

  protected onClickScrollRight(): void {
    this.selectedItemIndex = clamp(
      this.selectedItemIndex + 1,
      0,
      this.discoverItems.length - 1
    );
    this.selectedItem = this.discoverItems[this.selectedItemIndex];
  }

  // template get functions

  protected get backdropUrl(): string {
    if (this.selectedItem == null) return '';
    if (this.selectedItem.backdrop_path == null) return '';
    else return TMDB_IMAGE_ORIGINAL_BASE_URL + this.selectedItem.backdrop_path;
  }

  protected onClickMediaInfo(): void {
    if (this.selectedItem != null) {
      this.clickOnSearchEntry.emit(this.selectedItem);
    }
  }
}
