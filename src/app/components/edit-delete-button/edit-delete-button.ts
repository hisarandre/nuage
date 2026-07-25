import { Component, HostListener, inject, input, output, signal } from '@angular/core';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';
import { ViewportService } from '../../core/services/viewport.service';

@Component({
  selector: 'app-edit-delete-button',
  imports: [LucideAngularModule],
  templateUrl: './edit-delete-button.html',
})
export class EditDeleteButton {
  protected readonly Trash2 = Trash2;
  protected readonly Pencil = Pencil;

  private viewportService = inject(ViewportService);

  itemId = input.required<string>();
  floating = input(true);
  isMobile = this.viewportService.isMobile;

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
