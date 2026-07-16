import { Component, computed, input, output } from '@angular/core';
import { LucideAngularModule, Pencil, Plus, Trash2 } from 'lucide-angular';

@Component({
  selector: 'app-collection-card',
  imports: [LucideAngularModule],
  templateUrl: './collection-card.html',
})
export class CollectionCard {
  protected readonly Plus = Plus;
  protected readonly Trash2 = Trash2;

  title = input('');
  icon = input('📦');
  color = input<'peach' | 'sky' | 'cloud' | 'lilac' | 'mint' | 'butter' | 'blush'>('mint');

  edit  = output<void>();
  delete = output<void>();

  colorVar = computed(() => `var(--${this.color()})`);

  onEdit(event?: MouseEvent){
    (event?.currentTarget as HTMLElement).blur();
    this.edit.emit();
  }
  onDelete(event?: MouseEvent){
    (event?.currentTarget as HTMLElement).blur();
    this.delete.emit();
  }

  protected readonly Pencil = Pencil;
}
