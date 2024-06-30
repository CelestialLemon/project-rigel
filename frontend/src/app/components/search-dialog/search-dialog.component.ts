import { FlexibleConnectedPositionStrategy, Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [
    OverlayModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss'
})
export class SearchDialogComponent {

  protected searchValue: string = '';

  public get isOpen(): boolean {
    return this._isOpen;
  }

  constructor(private overlay: Overlay, private elementRef: ElementRef<HTMLElement>) {}

  @ViewChild('searchDialogTemplate', { read: TemplateRef, static: true }) dialogTemplate!: TemplateRef<any>;
  @ViewChild('vcr', { read: ViewContainerRef, static: true }) vcr!: ViewContainerRef;

  private overlayRef: OverlayRef | null = null;
  private templatePortal: TemplatePortal | null = null;
  private _isOpen: boolean = false;
  private destroy$: Subject<void> = new Subject<void>;

  // angular lifecycle functions
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

  // component functions
  private createOverlay(): void {
    const parentElement = this.elementRef.nativeElement.parentElement;
    if (parentElement == null) return;

    this.overlayRef = this.overlay.create({
      positionStrategy: this.getPositionStrategy(parentElement),
      hasBackdrop: false
    });

    this.templatePortal = new TemplatePortal(this.dialogTemplate, this.vcr);
  }

  private getPositionStrategy(parentElement: HTMLElement): FlexibleConnectedPositionStrategy {
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
          offsetY: 0
        }
      ]);
  }
}
