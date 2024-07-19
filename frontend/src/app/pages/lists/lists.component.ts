import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { UserDataService } from '../../services/user-data.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as runtime from '../../../../wailsjs/runtime/runtime';
import { main } from '../../../../wailsjs/go/models';
import { Subject, takeUntil } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, MatButtonModule, MatTabsModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListsComponent {
  // parameters
  private userDataService = inject(UserDataService);

  protected mvLists = signal<main.MVWatchList[]>([]);
  protected tvLists = signal<main.TVWatchList[]>([]);

  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {
    this.userDataService.userData.pipe(takeUntil(this.destroy$)).subscribe((newUserData) => {
      this.mvLists.set(newUserData.mvlists);
      this.tvLists.set(newUserData.tvlists);
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
