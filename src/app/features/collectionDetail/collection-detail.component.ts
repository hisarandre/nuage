import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CollectionService } from '../../core/services/collection.service';
import { Collection } from '../../core/models/collection.type';
import { Header } from '../../components/header/header';
import { EmptyCreateButton } from '../../components/empty-create-button/empty-create-button';
import { ArrowLeft, LucideAngularModule, Plus, Search } from 'lucide-angular';
import { Button } from '../../components/button/button';
import { ItemService } from '../../core/services/item.service';
import { Item } from '../../core/models/item.type';
import { AddItem } from '../../components/add-item/add-item';
import { ItemCard } from '../../components/item-card/item-card';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { Loading } from '../../components/loading/loading';
import { TagFilter, TagCount } from '../../components/tag-filter/tag-filter';
import { ViewToggle, ViewMode } from '../../components/view-toggle/view-toggle';
import { ViewportService } from '../../core/services/viewport.service';

@Component({
  selector: 'app-collectionDetail',
  imports: [
    LucideAngularModule,
    Button,
    Header,
    RouterLink,
    EmptyCreateButton,
    AddItem,
    ItemCard,
    ConfirmDialog,
    Loading,
    TagFilter,
    ViewToggle,
  ],
  templateUrl: './collection-detail.component.html',
})
export class CollectionDetail implements OnInit {
  protected readonly Plus = Plus;
  protected readonly ArrowLeft = ArrowLeft;
  protected readonly Search = Search;

  private route = inject(ActivatedRoute);
  private toast = inject(ToastrService);
  private collectionService = inject(CollectionService);
  private itemService = inject(ItemService);
  private viewportService = inject(ViewportService);

  collection = signal<Collection | null>(null);
  items = signal<Item[] | null>(null);
  loading = signal(false);
  isMobile = this.viewportService.isMobile;

  openAddItemDialog = false;
  selectedItem: Item | null = null;
  itemToDelete: Item | null = null;

  selectedTags = signal<string[]>([]);
  searchQuery = signal('');
  viewMode = signal<ViewMode>('grid');

  cardStyle = computed(() => ({
    background: `var(--${this.collection()?.color ?? 'cloud'})`,
  }));

  availableTags = computed<TagCount[]>(() => {
    const counts = new Map<string, number>();
    for (const item of this.items() ?? []) {
      for (const tag of item.tags ?? []) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).map(([tag, count]) => ({ tag, count }));
  });

  filteredItems = computed(() => {
    const all = this.items() ?? [];
    const selected = this.selectedTags();
    const query = this.searchQuery().trim().toLowerCase();

    let result = all;

    if (selected.length > 0) {
      result = result.filter(item => selected.every(tag => item.tags?.includes(tag)));
    }

    if (query) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
    }

    return result;
  });

  itemLabel = computed(() => {
    const total = this.items()?.length ?? 0;
    const filtered = this.filteredItems().length;

    if (this.selectedTags().length > 0 || this.searchQuery().trim()) {
      return `${filtered} / ${total} élément${total > 1 ? 's' : ''}`;
    }

    return `${total} élément${total > 1 ? 's' : ''}`;
  });

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.loading.set(true);
    try {
      await Promise.all([this.loadCollection(id), this.loadItems(id)]);
    } finally {
      this.loading.set(false);
    }
  }

  async loadCollection(id: string) {
    this.collection.set(await this.collectionService.getById(id));
  }

  async loadItems(id: string) {
    try {
      const data = await this.itemService.getByCollection(id);
      this.items.set(data);
    } catch (err) {
      this.items.set([]);
    }
  }

  onSearchInput(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  toggleTag(tag: string) {
    this.selectedTags.update(list =>
      list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]
    );
  }

  clearTags() {
    this.selectedTags.set([]);
  }

  addItem() {
    this.selectedItem = null;
    this.openAddItemDialog = true;
  }

  editItem(itemId: string) {
    this.selectedItem = this.items()?.find(i => i.id === itemId) ?? null;
    this.openAddItemDialog = true;
  }

  closeItemDialog() {
    this.openAddItemDialog = false;
    this.selectedItem = null;
  }

  askDelete(itemId: string) {
    this.itemToDelete = this.items()?.find(i => i.id === itemId) ?? null;
  }

  async confirmDelete() {
    if (!this.itemToDelete) return;

    const id = this.itemToDelete.id;

    try {
      await this.itemService.delete(id);
      this.items.update(list => (list ?? []).filter(i => i.id !== id));
      this.toast.success('Élément supprimé');
    } catch (err) {
      this.toast.error('Erreur lors de la suppression');
    } finally {
      this.itemToDelete = null;
    }
  }

  onItemCreated(item: Item) {
    this.items.update(list => [item, ...(list ?? [])]);
  }

  onItemEdited(item: Item) {
    this.items.update(list => (list ?? []).map(i => (i.id === item.id ? item : i)));
  }
}
