import {
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayModule,
  OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  signal,
  effect,
} from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MediaType } from '../../tmdb.models';
import { debounce } from '../../utilities/utilities';
import { SearchEntry, MVEntry, TVEntry } from '../../tmdb.models';
import { TmdbService } from '../../tmdb.service';
import { TMDB_IMAGE_W500_BASE_URL } from '../../constants';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [
    OverlayModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatChipsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchDialogComponent {
  public searchValue = signal<string>('');
  public mediaType = signal<MediaType>(MediaType.MOVIE);
  public searchEntries = signal<SearchEntry[]>([]);

  protected genreMap = new Map<number, string>();

  public get isOpen(): boolean {
    return this._isOpen;
  }

  constructor(
    private readonly overlay: Overlay,
    private readonly elementRef: ElementRef<HTMLElement>,
    private tmdbService: TmdbService,
    private router: Router
  ) {
    effect(() => {
      this.search(this.searchValue(), this.mediaType());
    });
  }

  @ViewChild('searchDialogTemplate', { read: TemplateRef, static: true })
  protected dialogTemplate!: TemplateRef<any>;
  @ViewChild('vcr', { read: ViewContainerRef, static: true })
  protected vcr!: ViewContainerRef;

  private overlayRef: OverlayRef | null = null;
  private templatePortal: TemplatePortal | null = null;
  private _isOpen: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  // angular lifecycle functions
  ngOnInit(): void {
    this.createGenreMap();
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // public functions
  public open(): void {
    if (this.overlayRef == null) {
      this.createOverlay();
    }

    if (this.overlayRef == null || this.templatePortal == null) return;

    this.overlayRef.attach(this.templatePortal);
    this._isOpen = true;
  }

  public close(): void {
    if (this.overlayRef == null || this.templatePortal == null) return;

    this.overlayRef.detach();
    this._isOpen = false;
  }

  // event functions
  protected onSearchInputChange(val: string): void {
    this.searchValue.set(val);
  }

  protected onChangeMediaType(newMediaType: string) {
    this.mediaType.set(newMediaType as MediaType);
    console.log(this.mediaType());
  }

  protected onClickSearchEntry(entry: SearchEntry): void {
    this.router.navigate(['/media-details'], { queryParams: { id: entry.mediaId, type: entry.type }});
    this.close();
  }

  // component functions

  private async createGenreMap() {
    // const
    const mvGenres = await this.tmdbService.getGenres(MediaType.MOVIE);
    const tvGenres = await this.tmdbService.getGenres(MediaType.TV);

    const combinedArray = [...mvGenres, ...tvGenres];

    combinedArray.forEach(genre => {
      this.genreMap.set(genre.id, genre.name);
    })
  }


  private createOverlay(): void {
    const parentElement = this.elementRef.nativeElement.parentElement;
    if (parentElement == null) return;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.getPositionStrategy(parentElement),
      hasBackdrop: false,
    });

    this.templatePortal = new TemplatePortal(this.dialogTemplate, this.vcr);
  }

  private getPositionStrategy(
    parentElement: HTMLElement
  ): FlexibleConnectedPositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(parentElement)
      .withPositions([
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
          offsetX: -8,
          offsetY: 0,
        },
      ]);
  }

  private readonly search = debounce(
    async (searchValue: string, mediaType: MediaType) => {
      if (searchValue == '' || searchValue == null) return;

      const results = await this.tmdbService.searchMedia(
        searchValue,
        mediaType
      );

      const entries = results.map((element): SearchEntry => {
        let title = '';
        let date = '';
        if ('name' in element) title = element.name;
        if ('title' in element) title = element.title;
        if ('release_date' in element) date = element.release_date;
        if ('first_air_date' in element) date = element.first_air_date;

        return {
          title: title,
          overview: element.overview,
          backdrop_path: element.backdrop_path,
          type: mediaType,
          mediaId: element.id,
          poster_path: element.poster_path,
          date: date,
          genres: element.genre_ids.map(id => this.genreMap.get(id) ?? '')
        };
      });

      this.searchEntries.set(entries);
    },
    1000
  );

  // template get functions
  protected get TMDB_IMAGE_W500_BASE_URL(): string {
    return TMDB_IMAGE_W500_BASE_URL;
  }
}
