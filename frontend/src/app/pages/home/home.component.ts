import { Component } from '@angular/core';
import { DiscoverSectionComponent } from '../../components/discover-section/discover-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DiscoverSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
