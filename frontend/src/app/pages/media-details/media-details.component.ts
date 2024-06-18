import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaDetailsResponse } from '../../tmdb.models';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TMDB_API_BASE_URL, TMDB_API_KEY, TMDB_IMAGE_BASE_URL } from '../../constants';
import { TmdbService } from '../../tmdb.service';

@Component({
  selector: 'app-media-details',
  standalone: true,
  imports: [HttpClientModule],
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

}
