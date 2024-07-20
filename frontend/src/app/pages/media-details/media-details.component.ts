import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MediaTVDetailsResponse, MediaTVSeasonResponse, MediaCreditsResponse, MediaTVImagesResponse, MediaTVVideosResponse, MediaMVDetailsResponse, MediaGenre, MediaType, MVWatchStatus, TVWatchStatus } from '../../tmdb.models';
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
import { Subject, takeUntil } from 'rxjs';

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
		MatListModule,
	],
	providers: [TmdbService],
	templateUrl: './media-details.component.html',
	styleUrl: './media-details.component.scss',
})
export class MediaDetailsComponent {
	protected mediaId = signal<string | null>(null);
	protected mediaType = signal<MediaType>(MediaType.MOVIE);

	// signal to be updated when user data from service changes
	// will be used to trigger computed signals that should be recomputed on data update
	// not sure if this is the best approach tho
	protected userDataUpdate = signal(0);

	protected mvWatchStatus = computed(() => {
		// call this here to allow this computed signal to trigger on data update
		this.userDataUpdate();

		if (this.mediaType() === MediaType.MOVIE) {
			return this.userDataService.getMovieStatus(this.mediaId() ?? '');
		} else {
			return MVWatchStatus.UNWATCHED;
		}
	});

	protected tvWatchStatus = computed(() => {
		// call this here to allow this computed signal to trigger on data update
		this.userDataUpdate();

		if (this.mediaType() === MediaType.TV) {
			return this.userDataService.getTVShowStatus(this.mediaId() ?? '');
		} else {
			return TVWatchStatus.UNWATCHED;
		}
	});

	protected mediaTVDetails: MediaTVDetailsResponse | null = null;
	protected activeSeasonDetails: MediaTVSeasonResponse | null = null;
	protected activeSeasonNumber: number | null = null;

	protected creditDetails: MediaCreditsResponse | null = null;
	protected imagesDetails: MediaTVImagesResponse | null = null;
	protected videosDetails: MediaTVVideosResponse | null = null;

	protected mediaMVDetails: MediaMVDetailsResponse | null = null;

	private userDataService = inject(UserDataService);

	private destroy$ = new Subject<void>();

	constructor(
		private route: ActivatedRoute,
		private tmdbService: TmdbService,
		private sanitizer: DomSanitizer
	) {}

	ngOnInit() {
		this.route.queryParamMap.subscribe((params) => {
			this.handleParamsUpdate(params);
		});

		this.userDataService.userData
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.userDataUpdate.set(this.userDataUpdate() + 1);
			});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

	// component functions

	private async handleParamsUpdate(params: ParamMap) {
		// get media type and condense to type
		const mediaTypeParam = params.get('type');
		if (
			mediaTypeParam != null &&
			Object.values(MediaType).includes(mediaTypeParam as MediaType)
		) {
			this.mediaType.set(mediaTypeParam as MediaType);
		}

		// get media id
		this.mediaId.set(params.get('id'));
		const mediaId = this.mediaId();
		const mediaType = this.mediaType();
		// if both params are present fetch the media details
		if (mediaId != null && mediaType != null) {
			if (mediaType === MediaType.MOVIE) {
				this.mediaMVDetails = (await this.tmdbService.getMediaDetails(
					mediaId,
					mediaType
				)) as MediaMVDetailsResponse;
			} else if (mediaType === MediaType.TV) {
				this.mediaTVDetails = (await this.tmdbService.getMediaDetails(
					mediaId,
					mediaType
				)) as MediaTVDetailsResponse;
				this.activeSeasonDetails =
					await this.tmdbService.getMediaTVSeasonDetails(mediaId, 1);
				this.activeSeasonNumber =
					this.activeSeasonDetails.season_number;
			} else {
				console.error('Un-supported media type');
			}

			this.creditDetails = await this.tmdbService.getMediaCreditsDetails(
				mediaId,
				mediaType
			);
			this.imagesDetails = await this.tmdbService.getMediaImagesDetails(
				mediaId,
				mediaType
			);
			this.videosDetails = await this.tmdbService.getMediaVideosDetails(
				mediaId,
				mediaType
			);
		}
	}

	// event function

	protected async onActiveSeasonChange(newActiveSeason: number) {
		const mediaId = this.mediaId();
		if (mediaId == null) return;

		this.activeSeasonDetails =
			await this.tmdbService.getMediaTVSeasonDetails(
				mediaId,
				newActiveSeason
			);
	}

	protected async onClickStartWatching() {
		if (
			this.mediaType() === MediaType.MOVIE &&
			this.mediaMVDetails != null
		) {
			// create the movie object
			const movie = this.createMovieObject(this.mediaMVDetails);
			if (this.mvWatchStatus() === MVWatchStatus.PLANTOWATCH) {
				this.userDataService.moveMovieToList(
					MVWatchStatus.PLANTOWATCH,
					MVWatchStatus.WATCHING,
					movie
				);
			} else if (this.mvWatchStatus() === MVWatchStatus.UNWATCHED) {
				this.userDataService.addMovieToList(
					MVWatchStatus.WATCHING,
					movie
				);
			} else {
				console.error('Cannot move from list');
			}
		} else if (
			this.mediaType() === MediaType.TV &&
			this.mediaTVDetails != null
		) {
			// create the tvshow object
		}
	}

	protected async onClickPlanToWatch() {
		const mediaId = this.mediaId();
		if (mediaId == null) return;

		if (this.mediaType() === MediaType.MOVIE) {
			if (this.mediaMVDetails == null) return;
			const movieToAdd = this.createMovieObject(this.mediaMVDetails);
			await this.userDataService.addMovieToList(
				'Plan to Watch',
				movieToAdd
			);
		} else if (this.mediaType() === MediaType.TV) {
			if (this.mediaTVDetails == null) return;

			let tvShowToAdd = new main.TVShow();
			tvShowToAdd.id = mediaId;
			tvShowToAdd.name = this.mediaTVDetails.name;
			tvShowToAdd.poster_path = this.mediaTVDetails.poster_path;

			await this.userDataService.addTVShowToList(
				'Plan to Watch',
				tvShowToAdd
			);
		}
	}

	// template get functions

	protected get mediaTitle(): string {
		switch (this.mediaType()) {
			case MediaType.MOVIE:
				return this.mediaMVDetails?.title ?? '';

			case MediaType.TV:
				return this.mediaTVDetails?.name ?? '';

			default:
				return '';
		}
	}

	protected get mediaOverview(): string {
		switch (this.mediaType()) {
			case MediaType.MOVIE:
				return this.mediaMVDetails?.overview ?? '';

			case MediaType.TV:
				return this.mediaTVDetails?.overview ?? '';
			default:
				return '';
		}
	}

	protected get mediaGenres(): string[] {
		let genres: MediaGenre[] = [];

		switch (this.mediaType()) {
			case MediaType.MOVIE:
				genres = this.mediaMVDetails?.genres ?? [];
				break;

			case MediaType.TV:
				genres = this.mediaTVDetails?.genres ?? [];
				break;

			default:
				genres = [];
				break;
		}

		return genres.map((genre) => genre.name);
	}

	protected get posterUrl(): string {
		let poster_path = '';

		switch (this.mediaType()) {
			case MediaType.MOVIE:
				poster_path = this.mediaMVDetails?.poster_path ?? '';
				break;

			case MediaType.TV:
				poster_path = this.mediaTVDetails?.poster_path ?? '';
				break;

			default:
				poster_path = '';
				break;
		}

		return TMDB_IMAGE_W500_BASE_URL + poster_path;
	}

	protected get backdropUrl(): string {
		let backdrop_path = '';

		switch (this.mediaType()) {
			case MediaType.MOVIE:
				backdrop_path = this.mediaMVDetails?.backdrop_path ?? '';
				break;

			case MediaType.TV:
				backdrop_path = this.mediaTVDetails?.backdrop_path ?? '';
				break;

			default:
				backdrop_path = '';
				break;
		}

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

		return (
			TMDB_IMAGE_ORIGINAL_BASE_URL + this.activeSeasonDetails.poster_path
		);
	}

	protected getSanitizedUrl(inputUrl: string): SafeResourceUrl {
		return this.sanitizer.bypassSecurityTrustResourceUrl(inputUrl);
	}

	// -------------------------------------------------------------------------
	// component functions

	/**
	 * Creates a main.Movie object given current media details
	 * @returns created movie object
	 */
	private createMovieObject(
		mediaMVDetails: MediaMVDetailsResponse
	): main.Movie {
		let movieToAdd = new main.Movie();
		movieToAdd.id = mediaMVDetails.id.toString();
		movieToAdd.name = mediaMVDetails.title;
		movieToAdd.poster_path = mediaMVDetails.poster_path;
		return movieToAdd;
	}
}
