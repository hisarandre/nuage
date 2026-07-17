import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseClientService {
  readonly client: SupabaseClient = createClient(
    environment.SUPABASE_URL,
    environment.SUPABASE_ANON
  );
}
