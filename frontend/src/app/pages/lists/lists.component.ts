import { Component, inject } from '@angular/core';
import { ListsService } from '../../services/lists.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent {

  // parameters
  private listsService = inject(ListsService);
  protected lists = this.listsService.lists;

  constructor() {}

  ngOnInit(): void {
  }
}
