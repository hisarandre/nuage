import {
  Component,
  computed, effect, inject,
  input,
  model,
  output,
  signal
} from '@angular/core';

import { Button } from '../button/button';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from '../../core/services/item.service';
import { Item, ItemData } from '../../core/models/item.type';
import { LucideAngularModule, ImagePlus, X } from 'lucide-angular';
import { compressImageUtil } from '../../core/utils/compress-image.util';

@Component({
  selector: 'app-add-item',
  imports: [Button, FormsModule, LucideAngularModule],
  templateUrl: './add-item.html',
})
export class AddItem {
  protected readonly ImagePlus = ImagePlus;
  protected readonly X = X;

  private toast = inject(ToastrService);
  private itemService = inject(ItemService);

  collectionId = input.required<string>();
  item = input<Item | null>(null);

  title = model('');
  description = model('');
  tags = signal<string[]>([]);
  tagInput = model('');

  imageFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);

  saving = signal(false);

  created = output<Item>();
  edited = output<Item>();
  close = output<void>();

  isEdit = computed(() => !!this.item());

  constructor() {
    effect(() => {
      const item = this.item();

      if (item) {
        this.title.set(item.title);
        this.description.set(item.description ?? '');
        this.tags.set(item.tags ?? []);
        this.imagePreview.set(item.image_url ?? null);
        this.imageFile.set(null);
      } else {
        this.title.set('');
        this.description.set('');
        this.tags.set([]);
        this.imagePreview.set(null);
        this.imageFile.set(null);
      }
      this.tagInput.set('');
    });
  }

  compressing = signal(false);

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.compressing.set(true);

    try {
      const compressed = await compressImageUtil(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.8,
      });

      this.imageFile.set(compressed);

      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(compressed);
    } catch (err) {
      this.toast.error("Erreur lors du traitement de l'image");
    } finally {
      this.compressing.set(false);
    }
  }

  removeImage() {
    this.imageFile.set(null);
    this.imagePreview.set(null);
  }

  onTagInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      this.addTag();
    }
  }

  addTag() {
    const value = this.tagInput().trim();
    if (!value || this.tags().includes(value)) {
      this.tagInput.set('');
      return;
    }

    this.tags.update(list => [...list, value]);
    this.tagInput.set('');
  }

  removeTag(tag: string) {
    this.tags.update(list => list.filter(t => t !== tag));
  }

  onClose() {
    if (this.saving()) return;
    this.close.emit();
  }

  async onCreate() {
    if (!this.title().trim() || this.saving()) {
      return;
    }

    const payload: ItemData = {
      collection_id: this.collectionId(),
      title: this.title(),
      description: this.description() || undefined,
      tags: this.tags(),
    };

    this.saving.set(true);

    try {
      const current = this.item();

      if (current) {
        const updated = await this.itemService.update(current.id, payload, this.imageFile() ?? undefined);
        this.toast.success('Élément mis à jour !');
        this.edited.emit(updated);
      } else {
        const created = await this.itemService.create(payload, this.imageFile() ?? undefined);
        this.toast.success('Élément ajouté avec succès !');
        this.created.emit(created);
      }

      this.close.emit();
    } catch (err) {
      this.toast.error(
        this.isEdit()
          ? "Erreur lors de la mise à jour de l'élément"
          : "Erreur lors de l'ajout de l'élément"
      );
    } finally {
      this.saving.set(false);
    }
  }
}
