import { Component, computed, effect, inject, input, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../models/client';
import { AccountListComponent } from '../account-list/account-list.component';
import { ApiService } from '../../services/api.service';
import { catchError, finalize, tap } from 'rxjs';
import { Account } from '../../models/account';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';

@Component({
  selector: 'app-client-card',
  standalone: true,
  imports: [CommonModule, AccountListComponent, PieChartComponent, BarChartComponent],
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss']
})
export class ClientCardComponent {
  private apiService = inject(ApiService);

  client = input.required<Client>();

  accounts = signal<Account[] | null>(null);
  pieChartData = signal<any[]>([]);
  barChartData = signal<any[]>([]);
  isAccordionOpen = signal<boolean>(false);
  selectedCardTypes = signal<Set<string>>(new Set());
  selectedBalanceType = signal<'positive' | 'negative' | null>(null);
  
  showDialog = false;
  private accountsLoaded = false;

  uniqueCardTypes = computed(() => {
    const accounts = this.accounts();
    return accounts ? [...new Set(accounts.map(d => d.card_type))] : [];
  });
  
  filteredAccounts = computed(() => {
    const accounts = this.accounts();
    const selectedTypes = this.selectedCardTypes();
    const balanceType = this.selectedBalanceType();
    
    if (!accounts) return null;
    
    let filtered = accounts;
    filtered = accounts.filter(account => selectedTypes.has(account.card_type));
    
    // Filter by balance type if selected (for pie chart)
    if (balanceType === 'positive') {
      filtered = filtered.filter(account => (account.balance) >= 0);
    } else if (balanceType === 'negative') {
      filtered = filtered.filter(account => (account.balance) < 0);
    }
    
    return filtered;
  });

  constructor() {
    // effect to initialize selected card types with all card types
    effect(() => {
      const accounts = this.accounts();
      if (accounts) {
        this.selectedCardTypes.set(new Set([...new Set(accounts.map(d => d.card_type))]));
      }
    }, { allowSignalWrites: true });
  }

  onPieChartSectionClick(section: any): void {
    this.selectedBalanceType.set(section.card_type)
  }

  onBarChartSectionClick(section: any): void {
    this.showAccounts();
  }

  resetFilters(): void {
    // Reset balance filter
    this.selectedBalanceType.set(null);
    // Reset card type filters to select all
    const accounts = this.accounts();
    if (accounts) {
      this.selectedCardTypes.set(new Set([...new Set(accounts.map(d => d.card_type))]));
    }
  }

  toggleCardType(cardType: string): void {
    const current = Array.from(this.selectedCardTypes());    
    // creating a new set each time ensures that the signal gets a new Set reference each time, which will trigger the computed filteredAccounts
    const updated = new Set(current);
    if (updated.has(cardType)) {
      updated.delete(cardType);
    } else {
      updated.add(cardType);
    }    
    this.selectedCardTypes.set(updated);
  }

  toggleAccordion() {
    this.isAccordionOpen.update(value => !value);
    if (!this.accountsLoaded) {
      this.getAccounts();
      this.accountsLoaded = true;
    }
  }

  showAccounts() {
    if (!this.accountsLoaded) {
      this.getAccounts();
      this.accountsLoaded = true;
    }
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  private getAccounts() {
    this.apiService.getAccountsByClient(this.client().id)
      .pipe(
        tap((accounts) => {
          this.accounts.set(accounts);
          this.pieChartData.set(this.groupAccountsByBalance());
        }),
        catchError(error => {
          console.error('Error fetching accounts:', error);
          return [];
        })
      )
      .subscribe();
  }

  private groupAccountsByBalance() {
    const accounts = this.accounts();
    if (!accounts) return [];

    const positiveAccounts = accounts.filter(account => (account.balance) >= 0);
    const negativeAccounts = accounts.filter(account => (account.balance) < 0);

    const sections = [
      { 
        card_type: 'positive', 
        balance: positiveAccounts.length,
        accounts: positiveAccounts
      },
      { 
        card_type: 'negative', 
        balance: negativeAccounts.length,
        accounts: negativeAccounts
      }
    ];

    return sections;
  }

} 
