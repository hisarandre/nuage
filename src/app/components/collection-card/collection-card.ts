import { Component, computed, input, output } from '@angular/core';
import { Collection } from '../../core/models/collection.type';
import { RouterLink } from '@angular/router';
import { EditDeleteButton } from '../edit-delete-button/edit-delete-button';

@Component({
  selector: 'app-collection-card',
  imports: [RouterLink, EditDeleteButton],
  templateUrl: './collection-card.html',
})
export class CollectionCard {
  collection = input.required<Collection>();

  edit = output<string>();
  delete = output<string>();

  colorVar = computed(() => `var(--${this.collection().color})`);

  onEdit(){
    this.edit.emit(this.collection().id)
  }

  onDelete(){
    this.delete.emit(this.collection().id)
  }
}
