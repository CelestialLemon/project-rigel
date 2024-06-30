import { FlexibleConnectedPositionStrategy, Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [OverlayModule],
  templateUrl: './search-dialog.component.html',
  styleUrl: './search-dialog.component.scss'
})
export class SearchDialogComponent {

  public get isOpen(): boolean {
    return this._isOpen;
  }

  constructor(private overlay: Overlay, private elementRef: ElementRef<HTMLElement>) {}

  @ViewChild('searchDialogTemplate', { read: TemplateRef, static: true }) dialogTemplate!: TemplateRef<any>;
  @ViewChild('vcr', { read: ViewContainerRef, static: true }) vcr!: ViewContainerRef;

  private overlayRef: OverlayRef | null = null;
  private templatePortal: TemplatePortal | null = null;
  private _isOpen: boolean = false;

  // angular lifecycle functions
  ngOnDestroy(): void {
    this.overlayRef?.dispose();
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
