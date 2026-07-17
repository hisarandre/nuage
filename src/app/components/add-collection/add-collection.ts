import {
  Component,
  computed, inject,
  input, model,
  output,
  signal
} from '@angular/core';

import { Button } from '../button/button';
import { CollectionData } from '../../core/model/collection.type';
import { emojis } from '../../core/model/emoji';
import { colors } from '../../core/model/colors';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-collection',
  imports: [Button, FormsModule],
  templateUrl: './add-collection.html',
})
export class AddCollection {
  protected readonly emojis = emojis;
  protected readonly colors = colors;

  private toast = inject(ToastrService);

  collection = input<CollectionData | null>(null);

  name = model('');
  selectedEmoji = signal(emojis[0]);
  selectedColor = signal<(typeof colors)[number]>('peach');

  close = output<void>();

  isEdit = computed(() => !!this.collection());

  cardStyle = computed(() => ({
    '--card': `var(--${this.selectedColor()})`,
  }));

  constructor() {
    const collection = this.collection();

    if (collection) {
      this.name.set(collection.name);
      this.selectedEmoji.set(collection.emoji);
      this.selectedColor.set(collection.color as (typeof colors)[number]);
    }
  }

  onClose() {
    this.close.emit();
  }

  onCreate() {
    this.toast.success('Connexion réussie 🎉');
    this.close.emit();

    if (!this.name().trim()) {
      return;
    }

  console.log({
    name: this.name(),
    emoji: this.selectedEmoji(),
    color: this.selectedColor(),
  })
  }
}
