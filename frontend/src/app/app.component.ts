import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Greet } from '../../wailsjs/go/main/App';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  async onClickButton() {
    this.title = await Greet("Ashutosh");
  }

}
