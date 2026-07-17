import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { CollectionCard } from '../../components/collection-card/collection-card';
import { CollectionButton } from '../../components/collection-button/collection-button';
import { AddCollection } from '../../components/add-collection/add-collection';
import { Collection } from '../../core/models/collection.type';
import { CollectionService } from '../../core/services/collection.service';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-dashboard',
  imports: [Header, CollectionCard, CollectionButton, AddCollection, LucideAngularModule, Button],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  protected readonly Plus = Plus;

  collectionService = inject(CollectionService);

  selectedCollection: Collection | null = null;
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
    this.selectedCollection = this.collections().find(c => c.id === collectionId) ?? null;
    this.openEditDialog = true;
  }

  async onDelete(collectionId: string) {
    try {
      await this.collectionService.delete(collectionId);
      this.collections.update(list => list.filter(c => c.id !== collectionId));
    } catch (err) {
      // gérer l'erreur (toast, etc.)
    }
  }

  close() {
    this.openAddDialog = false;
    this.openEditDialog = false;
    this.selectedCollection = null;
  }

  onCollectionCreated(collection: Collection) {
    this.collections.update(list => [collection, ...list]);
  }

  onCollectionEdited(collection: Collection) {
    this.collections.update(list =>
      list.map(c => (c.id === collection.id ? collection : c))
    );
  }
}
