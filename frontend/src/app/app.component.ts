import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		HomeComponent,
		ToolbarComponent,
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {}
