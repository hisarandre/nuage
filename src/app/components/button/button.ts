import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
})
export class Button {
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  variant = input<'primary' | 'outline'>('primary');

  protected classes = computed(() =>
    this.variant() === 'outline'
      ? 'bg-white border-2 border-primary'
      : 'bg-primary text-white'
  );

}
