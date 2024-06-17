import { Component } from '@angular/core';
import { DiscoverSectionComponent } from '../../components/discover-section/discover-section.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DiscoverSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private router: Router) {}

  protected onClickMediaEntry(mediaId: number): void {
    this.router.navigate(['/media-details'], {  queryParams: { 'id': mediaId }});
  }
}
