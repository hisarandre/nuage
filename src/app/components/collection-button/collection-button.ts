import { Component, output } from '@angular/core';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  selector: 'app-collection-button',
  imports: [LucideAngularModule],
  templateUrl: './collection-button.html',
})
export class CollectionButton {
  protected readonly Plus = Plus;

  add = output();

  onAdd(){
    this.add.emit();
  }
}
