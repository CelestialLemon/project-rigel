import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TMDB_API_KEY, TMDB_API_BASE_URL, TMDB_IMAGE_ORIGINAL_BASE_URL } from '../../constants';
import { DiscoverMVEntry, DiscoverTVEntry, DiscoverTVResponse } from '../../tmdb.models';
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
  styleUrl: './discover-section.component.scss'
})
export class DiscoverSectionComponent {
  /** Emitted when user clicks on the media info of any entry */
  @Output('clickMediaEntry') onClickMediaEntryEvent: EventEmitter<number> = new EventEmitter<number>();

  protected discoverTV: DiscoverTVEntry[] = [];
  protected discoverMV: DiscoverMVEntry[] = [];

  protected discoverItems: (DiscoverTVEntry | DiscoverMVEntry)[] = [];

  protected selectedItemIndex: number = 0;

  protected selectedItem: DiscoverMVEntry | DiscoverTVEntry | null = null;


  constructor(private tmdbService: TmdbService) {}


  async ngOnInit() {
    this.discoverTV = await this.tmdbService.getDiscoverMedia(MediaType.TV) as DiscoverTVEntry[];
    this.discoverMV = await this.tmdbService.getDiscoverMedia(MediaType.MOVIE) as DiscoverMVEntry[];

    this.discoverItems = this.discoverItems
      .concat(this.discoverTV.slice(0, 5))
      .concat(this.discoverMV.slice(0, 5));

    this.selectedItem = this.discoverItems[this.selectedItemIndex];
  }

  protected onClickScrollLeft(): void {
    this.selectedItemIndex = clamp(this.selectedItemIndex - 1, 0, this.discoverItems.length - 1);
    this.selectedItem = this.discoverItems[this.selectedItemIndex];
  }

  protected onClickScrollRight(): void {
    this.selectedItemIndex = clamp(this.selectedItemIndex + 1, 0, this.discoverItems.length - 1);
    this.selectedItem = this.discoverItems[this.selectedItemIndex];
  }

  // template get functions

  protected get mediaTitle(): string {
    if (this.selectedItem == null) return '';

    if ('name' in this.selectedItem) {
      return this.selectedItem.name;
    }
    if ('title' in this.selectedItem) {
      return this.selectedItem.title;
    }

    return '';
  }

  protected get mediaOverview(): string {
    if (this.selectedItem == null) return '';

    return this.selectedItem.overview;
  }

  protected get backdropUrl(): string {
    if (this.selectedItem == null) return '';
    if (this.selectedItem.backdrop_path == null) return '';

    else return TMDB_IMAGE_ORIGINAL_BASE_URL + this.selectedItem.backdrop_path;
  }

  protected onClickMediaInfo(): void {
    if (this.selectedItem != null) {
      this.onClickMediaEntryEvent.emit(this.selectedItem.id);
    }
  }
}
