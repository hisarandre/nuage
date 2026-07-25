import { Component, computed, input, output } from '@angular/core';
import { Item } from '../../core/models/item.type';
import { NgOptimizedImage } from '@angular/common';
import { EditDeleteButton } from '../edit-delete-button/edit-delete-button';
import { Collection } from '../../core/models/collection.type';

@Component({
  selector: 'app-item-card',
  imports: [EditDeleteButton],
  templateUrl: './item-card.html',
})
export class ItemCard {
  item = input.required<Item>();
  layout = input<'grid' | 'list'>('grid');

  isList = computed(() => this.layout() === 'list');
  edit = output<string>();
  delete = output<string>();

  onEdit(){
    this.edit.emit(this.item().id)
  }

  onDelete(){
    this.delete.emit(this.item().id)
  }
}
