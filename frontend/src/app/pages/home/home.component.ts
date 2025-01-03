import { Component, inject } from '@angular/core';
import { DiscoverSectionComponent } from '../../components/discover-section/discover-section.component';
import { Router } from '@angular/router';
import { SearchEntry } from '../../tmdb.models';
import { UserDataService } from '../../services/user-data.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [DiscoverSectionComponent],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss',
})
export class HomeComponent {
	private userDataService = inject(UserDataService);
	constructor(private router: Router) {}

	protected onClickMediaEntry(item: SearchEntry): void {
		this.router.navigate(['/media-details'], {
			queryParams: { id: item.mediaId, type: item.type },
		});
	}
}
