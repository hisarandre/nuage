import { Component, inject } from '@angular/core';
import { Button } from '../button/button';
import { LucideAngularModule, LogOut } from 'lucide-angular';
import { AuthService } from '../../features/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule, Button],
  templateUrl: './header.html',
})
export class Header {
  private auhtService = inject(AuthService)
  private router = inject(Router);
  private toast = inject(ToastrService);

  logOut() {
    this.auhtService.signOut()
    this.router.navigateByUrl('/login');
  }

  protected readonly LogOut = LogOut;
}
