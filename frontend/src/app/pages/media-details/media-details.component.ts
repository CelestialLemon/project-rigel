import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MediaTVDetailsResponse, MediaTVSeasonResponse, MediaCreditsResponse, MediaTVImagesResponse, MediaTVVideosResponse, MediaMVDetailsResponse, MediaGenre } from '../../tmdb.models';
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
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserDataService } from '../../services/user-data.service';
import { main } from '../../../../wailsjs/go/models';

export enum MediaType {
  MOVIE = 'movie',
  TV = 'tv'
};

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
    MatListModule
  ],
  providers: [TmdbService],
  templateUrl: './media-details.component.html',
  styleUrl: './media-details.component.scss',
})
export class MediaDetailsComponent {
  protected mediaId: string | null = null;
  protected mediaType: MediaType | null = null;

  protected mediaTVDetails: MediaTVDetailsResponse | null = null;
  protected activeSeasonDetails: MediaTVSeasonResponse | null = null;
  protected activeSeasonNumber: number | null = null;

  protected creditDetails: MediaCreditsResponse | null = null;
  protected imagesDetails: MediaTVImagesResponse | null = null;
  protected videosDetails: MediaTVVideosResponse | null = null;

  protected mediaMVDetails: MediaMVDetailsResponse | null = null;

  private userDataService = inject(UserDataService);

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.handleParamsUpdate(params);
    });
  }

  // component functions

  private async handleParamsUpdate(params: ParamMap) {
    // get media type and condense to type
    const mediaType = params.get('type');
    if (mediaType != null && Object.values(MediaType).includes(mediaType as MediaType)) {
      this.mediaType = mediaType as MediaType;
    }

    // get media id
    this.mediaId = params.get('id');

    // if both params are present fetch the media details
    if (this.mediaId != null && this.mediaType != null) {
      if (this.mediaType === MediaType.MOVIE) {
        this.mediaMVDetails = await this.tmdbService.getMediaDetails(this.mediaId, this.mediaType) as MediaMVDetailsResponse;
      }
      else if (this.mediaType === MediaType.TV) {
        this.mediaTVDetails = await this.tmdbService.getMediaDetails(this.mediaId, this.mediaType) as MediaTVDetailsResponse;
        this.activeSeasonDetails =
        await this.tmdbService.getMediaTVSeasonDetails(this.mediaId, 1);
      this.activeSeasonNumber = this.activeSeasonDetails.season_number;
      }
      else {
        console.error("Un-supported media type");
      }

      this.creditDetails = await this.tmdbService.getMediaCreditsDetails(this.mediaId, this.mediaType);
      this.imagesDetails = await this.tmdbService.getMediaImagesDetails(this.mediaId, this.mediaType);
      this.videosDetails = await this.tmdbService.getMediaVideosDetails(this.mediaId, this.mediaType);

    }
  }

  // event function

  protected async onActiveSeasonChange(newActiveSeason: number) {
    if (this.mediaId == null) return;

    this.activeSeasonDetails = await this.tmdbService.getMediaTVSeasonDetails(this.mediaId, newActiveSeason);
  }

  protected onClickPlanToWatch(): void {
    if (this.mediaId == null) return;

    if (this.mediaType === MediaType.MOVIE) {
      if (this.mediaMVDetails == null) return;


      let movieToAdd = new main.Movie();
      movieToAdd.id = this.mediaId;
      movieToAdd.name = this.mediaMVDetails.title;

      const userData = this.userDataService.getUserData();
      userData.mvlists.find((list) => list.name === 'Plan to Watch')?.items.push(movieToAdd);
      this.userDataService.updateUserData(userData);
    }
    else if (this.mediaType === MediaType.TV) {
      if (this.mediaTVDetails == null) return;

      let tvShowToAdd = new main.TVShow();
      tvShowToAdd.id = this.mediaId;
      tvShowToAdd.name = this.mediaTVDetails.name;

      const userData = this.userDataService.getUserData();
      userData.tvlists.find((list) => list.name === 'Plan to Watch')?.items.push(tvShowToAdd);
      this.userDataService.updateUserData(userData);
    }
  }

  // template get functions

  protected get mediaTitle(): string {

    switch(this.mediaType) {
      case MediaType.MOVIE:
        return this.mediaMVDetails?.title ?? '';

      case MediaType.TV:
        return this.mediaTVDetails?.name ?? '';

      default:
        return ''
    };

  }

  protected get mediaOverview(): string {

    switch(this.mediaType) {
      case MediaType.MOVIE:
        return this.mediaMVDetails?.overview ?? '';

      case MediaType.TV:
        return this.mediaTVDetails?.overview ?? '';
      default:
        return ''
    };
  }

  protected get mediaGenres(): string[] {
    let genres: MediaGenre[] = [];

    switch(this.mediaType) {
      case MediaType.MOVIE:
        genres = this.mediaMVDetails?.genres ?? [];
        break

      case MediaType.TV:
        genres = this.mediaTVDetails?.genres ?? [];
        break

      default:
        genres = [];
        break
    };

    return genres.map(genre => genre.name);
  }

  protected get posterUrl(): string {

    let poster_path = '';

    switch(this.mediaType) {
      case MediaType.MOVIE:
        poster_path = this.mediaMVDetails?.poster_path ?? '';
        break;

      case MediaType.TV:
        poster_path = this.mediaTVDetails?.poster_path ?? '';
        break;

      default:
        poster_path = '';
        break;
    };

    return TMDB_IMAGE_W500_BASE_URL + poster_path;
  }

  protected get backdropUrl(): string {

    let backdrop_path = '';

    switch(this.mediaType) {
      case MediaType.MOVIE:
        backdrop_path = this.mediaMVDetails?.backdrop_path ?? '';
        break;

      case MediaType.TV:
        backdrop_path = this.mediaTVDetails?.backdrop_path ?? '';
        break;

      default:
        backdrop_path = '';
        break;
    };

    return TMDB_IMAGE_ORIGINAL_BASE_URL + backdrop_path;
  }

  protected get TMDB_IMAGE_ORIGINAL_BASE_URL(): string {
    return TMDB_IMAGE_ORIGINAL_BASE_URL;
  }

  protected get TMDB_IMAGE_W500_BASE_URL(): string {
    return TMDB_IMAGE_W500_BASE_URL;
  }

  protected get getActiveSeasonPoster(): string {
    if (this.activeSeasonDetails == null) return '';

    return TMDB_IMAGE_ORIGINAL_BASE_URL + this.activeSeasonDetails.poster_path;
  }

  protected getSanitizedUrl(inputUrl: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(inputUrl);
  }
}
