import {
  Component,
  computed, effect, inject,
  input, model,
  output,
  signal
} from '@angular/core';

import { Button } from '../button/button';
import { Collection, CollectionData } from '../../core/models/collection.type';
import { emojis } from '../../core/models/emoji';
import { colors } from '../../core/models/colors';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CollectionService } from '../../core/services/collection.service';

@Component({
  selector: 'app-add-collection',
  imports: [Button, FormsModule],
  templateUrl: './add-collection.html',
})
export class AddCollection {
  protected readonly emojis = emojis;
  protected readonly colors = colors;

  private toast = inject(ToastrService);
  private collectionService = inject(CollectionService);

  collection = input<Collection | null>(null);

  name = model('');
  selectedEmoji = signal(emojis[0]);
  selectedColor = signal<(typeof colors)[number]>('peach');

  saving = signal(false);

  created = output<Collection>();
  edited = output<Collection>();
  close = output<void>();

  isEdit = computed(() => !!this.collection());

  cardStyle = computed(() => ({
    '--card': `var(--${this.selectedColor()})`,
  }));

  constructor() {
    effect(() => {
      const collection = this.collection();

      if (collection) {
        this.name.set(collection.name);
        this.selectedEmoji.set(collection.emoji);
        this.selectedColor.set(collection.color as (typeof colors)[number]);
      } else {
        this.name.set('');
        this.selectedEmoji.set(emojis[0]);
        this.selectedColor.set('peach');
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  async onCreate() {
    if (!this.name().trim() || this.saving()) {
      return;
    }

    const payload: CollectionData = {
      name: this.name(),
      emoji: this.selectedEmoji(),
      color: this.selectedColor(),
    };

    this.saving.set(true);

    try {
      const current = this.collection();

      if (current) {
        const updated = await this.collectionService.update(current.id, payload);
        this.toast.success('Collection mise à jour !');
        this.edited.emit(updated);
      } else {
        const created = await this.collectionService.create(payload);
        this.toast.success('Collection créée avec succès !');
        this.created.emit(created);
      }

      this.close.emit();
    } catch (err) {
      this.toast.error(
        this.isEdit()
          ? "Erreur lors de la mise à jour de la collection"
          : "Erreur lors de la création de la collection"
      );
    } finally {
      this.saving.set(false);
    }
  }
}
