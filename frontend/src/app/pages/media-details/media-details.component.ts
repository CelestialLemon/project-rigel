import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
	MediaTVDetailsResponse,
	MediaTVSeasonResponse,
	MediaCreditsResponse,
	MediaTVImagesResponse,
	MediaTVVideosResponse,
	MediaMVDetailsResponse,
	MediaGenre,
	MediaType,
	MVWatchStatus,
	TVWatchStatus,
} from '../../tmdb.models';
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
		MatFormFieldModule,
		MatSelectModule,
	],
	providers: [TmdbService],
	templateUrl: './media-details.component.html',
	styleUrl: './media-details.component.scss',
})
export class MediaDetailsComponent {
	protected mediaId = signal<number>(0);
	protected mediaType = signal<MediaType>(MediaType.MOVIE);
	protected userDataUpdate = signal(0);
	protected watchStatus = signal<MVWatchStatus | TVWatchStatus>(
		TVWatchStatus.UNWATCHED
	);

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
		this.route.queryParamMap
			.pipe(takeUntil(this.destroy$))
			.subscribe((params) => {
				this.handleParamsUpdate(params);
			});

		this.userDataService.userData
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.userDataUpdate.set(this.userDataUpdate() + 1);
			});
		this.getMediaWatchStatus();
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
		this.mediaId.set(Number.parseInt(params.get('id') ?? '0'));
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

	private async getMediaWatchStatus() {
		let watchStatus: TVWatchStatus | MVWatchStatus =
			TVWatchStatus.UNWATCHED;
		if (this.mediaType() === MediaType.MOVIE) {
			watchStatus = (await this.userDataService.getMovieWatchStatus(
				this.mediaId()
			)) as MVWatchStatus;
		} else if (this.mediaType() === MediaType.TV) {
			watchStatus = (await this.userDataService.getTVShowWatchStatus(
				this.mediaId()
			)) as TVWatchStatus;
		}

		this.watchStatus.set(watchStatus);
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

	/** Handles updates of watch status by user */
	// newStatus as suggests is the new status set by user
	// this.mvWatchStatus() is the current (now old) watch status
	// newStatus is guaranteed to be different from current status
	protected async onMVWatchStatusChange(newStatus: MVWatchStatus) {
		if (this.mediaMVDetails == null) return;

		this.watchStatus.set(newStatus);
		const movie = this.createMovieObject(this.mediaMVDetails);
		this.userDataService.updateMovieWatchStatus(movie, newStatus);
	}

	/** Handles updates of watch status by user */
	// newStatus as suggests is the new status set by user
	// this.mvWatchStatus() is the current (now old) watch status
	// newStatus is guaranteed to be different from current status
	protected async onTVWatchStatusChange(newStatus: TVWatchStatus) {
		if (this.mediaTVDetails == null) return;
		this.watchStatus.set(newStatus);
		const tvShow = this.createTVShowObject(this.mediaTVDetails);
		this.userDataService.updateTVShowWatchStatus(tvShow, newStatus);
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

	public get MVWatchStatus() {
		return MVWatchStatus;
	}

	public get TVWatchStatus() {
		return TVWatchStatus;
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
		let movie = new main.Movie();
		movie.id = mediaMVDetails.id;
		movie.name = mediaMVDetails.title;
		movie.poster_path = mediaMVDetails.poster_path;
		return movie;
	}

	/**
	 * Creates a main.TVShow object given current media details
	 * @returns created tv show object
	 */
	private createTVShowObject(
		mediaTVDetails: MediaTVDetailsResponse
	): main.TVShow {
		let tvShow = new main.TVShow();
		tvShow.id = mediaTVDetails.id;
		tvShow.name = mediaTVDetails.name;
		tvShow.poster_path = mediaTVDetails.poster_path;
		return tvShow;
	}
}
