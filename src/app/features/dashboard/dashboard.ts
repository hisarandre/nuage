import { Component } from '@angular/core';
import { Header } from '../../components/header/header';
import { CollectionCard } from '../../components/collection-card/collection-card';
import { CollectionButton } from '../../components/collection-button/collection-button';
import { AddCollection } from '../../components/add-collection/add-collection';

@Component({
  selector: 'app-dashboard',
  imports: [Header, CollectionCard, CollectionButton, AddCollection],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  openAddDialog = false;

  add($event: void) {
    this.openAddDialog = true;
  }

  close($event: void) {
    this.openAddDialog = false;
  }
}
