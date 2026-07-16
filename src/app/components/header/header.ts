import { Component } from '@angular/core';
import { Button } from '../button/button';
import { LucideAngularModule, LogOut } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule, Button],
  templateUrl: './header.html',
})
export class Header {
  readonly LogOut = LogOut;

}
