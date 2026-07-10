import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
})
export class Button {
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
}
