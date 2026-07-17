import { SupabaseClientService } from '../../core/services/supabase.service';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase = inject(SupabaseClientService).client;

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signUp(email: string, password: string, username: string) {
    return await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username,
        },
      },
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  getUser() {
    return this.supabase.auth.getUser();
  }
}
