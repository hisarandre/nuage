import { Component, input, output } from '@angular/core';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-edit-delete-button',
  imports: [LucideAngularModule],
  templateUrl: './edit-delete-button.html',
})
export class EditDeleteButton {
  protected readonly Trash2 = Trash2;
  protected readonly Pencil = Pencil;

  itemId = input.required<string>();
  floating = input(true);

  edit = output<string>();
  delete = output<string>();

  onEdit(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }
    this.edit.emit(this.itemId());
  }

  onDelete(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.blur();
    }
    this.delete.emit(this.itemId());
  }
}
