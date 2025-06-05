import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../models/account';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-list.component.html',
})
export class AccountListComponent {

  loading = false;
  accounts = input<Account[] | null>(null);

} 