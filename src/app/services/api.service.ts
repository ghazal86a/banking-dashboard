import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client';
import { Account } from '../models/account';


@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api-ashen-chi.vercel.app/api';

  constructor() {}

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/clients`);
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/accounts`);
  }

  getAccountsByClient(clientId: string): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/accounts?client=${clientId}`);
  }
} 