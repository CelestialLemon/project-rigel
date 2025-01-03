import {
	Component,
	EventEmitter,
	HostListener,
	Output,
	ViewChild,
} from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { SearchDialogComponent } from '../search-dialog/search-dialog.component';

@Component({
	selector: 'app-toolbar',
	standalone: true,
	imports: [
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		SearchDialogComponent,
	],
	templateUrl: './toolbar.component.html',
	styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
	// variables

	@ViewChild('searchDialog', { read: SearchDialogComponent, static: true })
	searchDialog!: SearchDialogComponent;

	constructor(private router: Router) {}

	protected onClickTitle(): void {
		console.log('clicked on title');
		this.router.navigate(['/']);
	}

	protected onClickSearchButton(): void {
		if (!this.searchDialog.isOpen) {
			this.searchDialog.open();
		} else {
			this.searchDialog.close();
		}
	}

	protected onClickLists(event: Event): void {
		this.router.navigate(['/lists']);
	}

	@HostListener('keydown.escape')
	onClickEscape(): void {
		if (this.searchDialog.isOpen) {
			this.searchDialog.close();
		}
	}
}
