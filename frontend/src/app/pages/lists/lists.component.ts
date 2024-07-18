import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { ListsService } from '../../services/lists.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as runtime from '../../../../wailsjs/runtime/runtime';
import { main } from '../../../../wailsjs/go/models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, MatButtonModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListsComponent {
  // parameters
  private listsService = inject(ListsService);
  protected lists = signal<main.WatchList[]>([]);

  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {
    this.listsService.lists
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
      this.lists.set(val);
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
