import { Injectable, inject } from '@angular/core';
import { Collection, CollectionData } from '../models/collection.type';
import { SupabaseClientService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private supabase = inject(SupabaseClientService).client;

  async getAll(): Promise<Collection[]> {
    const { data, error } = await this.supabase
      .from('collections')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Collection | null> {
    const { data, error } = await this.supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(collectionData: CollectionData): Promise<Collection> {
    const { data, error } = await this.supabase
      .from('collections')
      .insert(collectionData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, collectionData: Partial<CollectionData>): Promise<Collection> {
    const { data, error } = await this.supabase
      .from('collections')
      .update(collectionData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    await this.deleteCollectionImages(id);

    const { error } = await this.supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  private async deleteCollectionImages(collectionId: string): Promise<void> {
    const { data: items, error } = await this.supabase
      .from('items')
      .select('image_url')
      .eq('collection_id', collectionId);

    if (error) throw error;

    const paths = (items ?? [])
      .map(item => item.image_url)
      .filter((url): url is string => !!url)
      .map(url => this.extractStoragePath(url))
      .filter((path): path is string => !!path);

    if (paths.length === 0) return;

    const { error: storageError } = await this.supabase.storage
      .from('items')
      .remove(paths);

    if (storageError) throw storageError;
  }

  private extractStoragePath(imageUrl: string): string | null {
    const path = imageUrl.split('/items/')[1];
    return path ?? null;
  }
}
