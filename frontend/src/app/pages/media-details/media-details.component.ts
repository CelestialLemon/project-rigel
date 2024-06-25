import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaDetailsResponse, MediaTVSeasonResponse, MediaTVCreditsResponse } from '../../tmdb.models';
import {
  TMDB_IMAGE_ORIGINAL_BASE_URL,
  TMDB_IMAGE_W500_BASE_URL,
} from '../../constants';
import { TmdbService } from '../../tmdb.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-media-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  providers: [TmdbService],
  templateUrl: './media-details.component.html',
  styleUrl: './media-details.component.scss',
})
export class MediaDetailsComponent {
  protected mediaId: string | null = null;
  protected mediaDetails: MediaDetailsResponse | null = null;
  protected activeSeasonDetails: MediaTVSeasonResponse | null = null;
  protected activeSeasonNumber: number | null = null;
  protected creditDetails: MediaTVCreditsResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(async (params) => {
      this.mediaId = params.get('id');
      if (this.mediaId != null) {
        this.mediaDetails = await this.tmdbService.getMediaDetails(
          this.mediaId
        );
        this.activeSeasonDetails =
          await this.tmdbService.getMediaTVSeasonDetails(this.mediaId, 1);
        this.activeSeasonNumber = this.activeSeasonDetails.season_number;
        this.creditDetails = await this.tmdbService.getMediaTVCreditsDetails(this.mediaId);
        console.log(this.creditDetails);
      }
    });
  }

  // event function

  protected async onActiveSeasonChange(newActiveSeason: number) {
    if (this.mediaId == null) return;

    this.activeSeasonDetails = await this.tmdbService.getMediaTVSeasonDetails(this.mediaId, newActiveSeason);
  }

  // template get functions

  protected get getPosterUrl(): string {
    if (this.mediaDetails == null) return '';

    return TMDB_IMAGE_W500_BASE_URL + this.mediaDetails.poster_path;
  }

  protected get getBackdropUrl(): string {
    if (this.mediaDetails == null) return '';

    return TMDB_IMAGE_ORIGINAL_BASE_URL + this.mediaDetails.backdrop_path;
  }

  protected get  TMDB_IMAGE_W500_BASE_URL(): string {
    return TMDB_IMAGE_W500_BASE_URL;
  }

  protected get  TMDB_IMAGE_ORIGINAL_BASE_URL(): string {
    return TMDB_IMAGE_ORIGINAL_BASE_URL;
  }

  protected get getActiveSeasonPoster(): string {
    if (this.activeSeasonDetails == null) return '';

    return TMDB_IMAGE_ORIGINAL_BASE_URL + this.activeSeasonDetails.poster_path;
  }

  protected get genres(): string[] {
    if (this.mediaDetails == null) return [];

    return this.mediaDetails.genres.map((genreEntry) => genreEntry.name);
  }
}
