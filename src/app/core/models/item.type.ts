export interface Item {
  id: string;
  collection_id: string;
  user_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tags: string[];
  created_at: string;
}

export interface ItemData {
  collection_id: string;
  title: string;
  description?: string;
  tags?: string[];
}
