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
  collectionColor = input<string>('cloud');
  collectionEmoji = input<string>('📦');

  edit = output<string>();
  delete = output<string>();

  isList = computed(() => this.layout() === 'list');
  hasImage = computed(() => !!this.item().image_url);

  placeholderStyle = computed(() => ({
    background: `var(--${this.collectionColor()})`,
  }));

  onEdit(){
    this.edit.emit(this.item().id)
  }

  onDelete(){
    this.delete.emit(this.item().id)
  }
}
