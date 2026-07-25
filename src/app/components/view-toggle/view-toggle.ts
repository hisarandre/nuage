import { Component, input, output } from '@angular/core';
import { LucideAngularModule, LayoutGrid, List } from 'lucide-angular';

export type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-view-toggle',
  imports: [LucideAngularModule],
  templateUrl: './view-toggle.html',
})
export class ViewToggle {
  protected readonly LayoutGrid = LayoutGrid;
  protected readonly List = List;

  mode = input.required<ViewMode>();
  change = output<ViewMode>();
}
