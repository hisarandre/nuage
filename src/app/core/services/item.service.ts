import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase.service';
import { Item, ItemData } from '../models/item.type';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private supabase = inject(SupabaseClientService).client;

  async getByCollection(collectionId: string): Promise<Item[]> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('collection_id', collectionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getById(id: string): Promise<Item | null> {
    const { data, error } = await this.supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(itemData: ItemData, image?: File): Promise<Item> {
    let image_url: string | null = null;

    if (image) {
      image_url = await this.uploadImage(image);
    }

    const { data, error } = await this.supabase
      .from('items')
      .insert({ ...itemData, image_url })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, itemData: Partial<ItemData>, image?: File): Promise<Item> {
    const payload: Partial<ItemData> & { image_url?: string } = { ...itemData };

    if (image) {
      payload.image_url = await this.uploadImage(image);
    }

    const { data, error } = await this.supabase
      .from('items')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const item = await this.getById(id);

    const { error } = await this.supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    if (item?.image_url) {
      await this.deleteImage(item.image_url);
    }
  }

  private async uploadImage(file: File): Promise<string> {
    const { data: userData, error: userError } = await this.supabase.auth.getUser();
    if (userError || !userData.user) throw userError ?? new Error('Not authenticated');

    const extension = file.name.split('.').pop();
    const path = `${userData.user.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await this.supabase.storage
      .from('items')
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { data } = this.supabase.storage.from('items').getPublicUrl(path);
    return data.publicUrl;
  }

  private async deleteImage(imageUrl: string): Promise<void> {
    // extrait le chemin depuis l'URL publique : .../items/{user_id}/{filename}
    const path = imageUrl.split('/items/')[1];
    if (!path) return;

    await this.supabase.storage.from('items').remove([path]);
  }
}
