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
      .order('created_at', { ascending: false });

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
    const { error } = await this.supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
