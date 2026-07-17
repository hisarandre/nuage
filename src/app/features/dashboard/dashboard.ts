import { Component, inject } from '@angular/core';
import { Header } from '../../components/header/header';
import { CollectionCard } from '../../components/collection-card/collection-card';
import { CollectionButton } from '../../components/collection-button/collection-button';
import { AddCollection } from '../../components/add-collection/add-collection';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  imports: [Header, CollectionCard, CollectionButton, AddCollection],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  openAddDialog = false;
  openEditDialog = false;

  add() {

    this.openAddDialog = true;
  }

  edit() {
    this.openEditDialog = true;
  }


  close() {
    this.openAddDialog = false;
  }
}
