import { Component, inject } from '@angular/core';
import { ListsService } from '../../services/lists.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as runtime from '../../../../wailsjs/runtime/runtime'

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, MatButtonModule],
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
