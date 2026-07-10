import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-switch-button',
  imports: [],
  templateUrl: './switch-button.html',
  host: { class: 'block' }
})
export class SwitchButton {
  active = input<'login' | 'signup'>('login');
  activeChange = output<'login' | 'signup'>();

  select(mode: 'login' | 'signup') {
    this.activeChange.emit(mode);
  }
}
