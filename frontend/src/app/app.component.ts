import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DiscoverSectionComponent } from './components/discover-section/discover-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DiscoverSectionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
