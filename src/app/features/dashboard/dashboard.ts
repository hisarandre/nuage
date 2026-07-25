import { Component, inject, OnInit, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Header } from '../../components/header/header';
import { CollectionCard } from '../../components/collection-card/collection-card';
import { CollectionButton } from '../../components/collection-button/collection-button';
import { AddCollection } from '../../components/add-collection/add-collection';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { Collection } from '../../core/models/collection.type';
import { CollectionService } from '../../core/services/collection.service';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { EmptyCreateButton } from '../../components/empty-create-button/empty-create-button';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-dashboard',
  imports: [
    Header,
    CollectionCard,
    CollectionButton,
    AddCollection,
    ConfirmDialog,
    LucideAngularModule,
    EmptyCreateButton,
    Loading,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

  private toast = inject(ToastrService);
  collectionService = inject(CollectionService);

  selectedCollection: Collection | null = null;
  collectionToDelete: Collection | null = null;

  openAddDialog = false;
  openEditDialog = false;

  collections = signal<Collection[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.loadCollections();
  }

  async loadCollections() {
    this.loading.set(true);
    try {
      const data = await this.collectionService.getAll();
      this.collections.set(data);
    } catch (err) {
      this.collections.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  add() {
    this.openAddDialog = true;
  }

  edit(collectionId: string) {
    this.selectedCollection = this.collections().find((c) => c.id === collectionId) ?? null;
    this.openEditDialog = true;
  }

  askDelete(collectionId: string) {
    this.collectionToDelete = this.collections().find((c) => c.id === collectionId) ?? null;
  }

  async confirmDelete() {
    if (!this.collectionToDelete) return;

    const id = this.collectionToDelete.id;

    try {
      await this.collectionService.delete(id);
      this.collections.update((list) => list.filter((c) => c.id !== id));
      this.toast.success('Collection supprimée');
    } catch (err) {
      this.toast.error('Erreur lors de la suppression');
    } finally {
      this.collectionToDelete = null;
    }
  }

  close() {
    this.openAddDialog = false;
    this.openEditDialog = false;
    this.selectedCollection = null;
  }

  onCollectionCreated(collection: Collection) {
    this.collections.update((list) => [collection, ...list]);
  }

  onCollectionEdited(collection: Collection) {
    this.collections.update((list) => list.map((c) => (c.id === collection.id ? collection : c)));
  }
}
