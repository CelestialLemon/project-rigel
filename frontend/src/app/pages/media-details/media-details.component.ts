import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaDetailsResponse } from '../../tmdb.models';
import { TMDB_IMAGE_BASE_URL } from '../../constants';
import { TmdbService } from '../../tmdb.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-media-details',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  providers: [TmdbService],
  templateUrl: './media-details.component.html',
  styleUrl: './media-details.component.scss'
})
export class MediaDetailsComponent {

  protected mediaDetails: MediaDetailsResponse | null = null;

  constructor(private route: ActivatedRoute, private tmdbService: TmdbService) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe(async (params) => {
      const mediaId = params.get('id');
      if (mediaId != null) {
        this.mediaDetails = await this.tmdbService.getMediaDetails(parseInt(mediaId));
      }
    })
  }

  protected get getPosterUrl(): string {
    if (this.mediaDetails == null) return '';

    return TMDB_IMAGE_BASE_URL + this.mediaDetails.poster_path;
  }

  protected get getBackdropUrl(): string {
    if (this.mediaDetails == null) return '';

    return TMDB_IMAGE_BASE_URL + this.mediaDetails.backdrop_path;
  }

  protected get genres(): string[] {
    if (this.mediaDetails == null) return [];

    return this.mediaDetails.genres.map(genreEntry => genreEntry.name);
  }

}
