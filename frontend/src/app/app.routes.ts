import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MediaDetailsComponent } from './pages/media-details/media-details.component';
import { ListsComponent } from './pages/lists/lists.component';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'media-details', component: MediaDetailsComponent },
	{ path: 'lists', component: ListsComponent },
];
