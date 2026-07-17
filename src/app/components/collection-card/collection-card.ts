import { Component, computed, input, output } from '@angular/core';
import { LucideAngularModule, Pencil, Plus, Trash2 } from 'lucide-angular';
import { Collection } from '../../core/models/collection.type';

@Component({
  selector: 'app-collection-card',
  imports: [LucideAngularModule],
  templateUrl: './collection-card.html',
})
export class CollectionCard {
  protected readonly Trash2 = Trash2;
  protected readonly Pencil = Pencil;

  collection = input.required<Collection>();

  edit  = output<void>();
  delete = output<void>();

  colorVar = computed(() => `var(--${this.collection().color})`);

  onEdit(event: MouseEvent) {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }
    this.edit.emit();
  }

  onDelete(event: MouseEvent) {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }
    this.delete.emit();
  }

}
