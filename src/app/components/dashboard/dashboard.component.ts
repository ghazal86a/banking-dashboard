import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientCardComponent } from '../client-card/client-card.component';
import { Client } from '../../models/client';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ClientCardComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);
    
  title = 'Banking Dashboard';
  clients = signal<Client[]>([]);
  filterText = signal<string>('');
  loading = signal<boolean>(true);

  filteredClients = computed(() => {
    const searchText = this.filterText().toLowerCase();
    return this.clients().filter(client => 
      client.firstname?.toLowerCase().includes(searchText)
    );
  });

  constructor() {}

  ngOnInit() {
    this.apiService.getClients().subscribe((clients) => {
      this.clients.set(clients as Client[]);
      this.loading.set(false);
    });
  }
} 