import { Component, input, output } from '@angular/core';
import { Button } from '../button/button';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-empty-create-button',
  imports: [Button, LucideAngularModule],
  templateUrl: './empty-create-button.html',
})
export class EmptyCreateButton {
  protected readonly Plus = Plus;

  buttonText = input("Ajouter")
  emoji = input("🗂️")
  title = input("")
  subText = input("Ajoute un élément")

  onAdd = output<void>();

  add(){
    this.onAdd.emit();
  }


}
