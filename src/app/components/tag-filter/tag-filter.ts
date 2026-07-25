import { Component, input, output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

export interface TagCount {
  tag: string;
  count: number;
}

@Component({
  selector: 'app-tag-filter',
  imports: [LucideAngularModule],
  templateUrl: './tag-filter.html',
})
export class TagFilter {
  protected readonly X = X;

  tags = input.required<TagCount[]>();
  selectedTags = input.required<string[]>();

  toggle = output<string>();
  clear = output<void>();

  isSelected(tag: string): boolean {
    return this.selectedTags().includes(tag);
  }
}
