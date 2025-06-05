import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientCardComponent } from './client-card.component';
import { ApiService } from '../../services/api.service';
import { of, throwError } from 'rxjs';
import { Client } from '../../models/client';
import { Account } from '../../models/account';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mockAccounts, mockClients } from '../../models/mocks/mockData';
import { By } from '@angular/platform-browser';

describe('ClientCardComponent', () => {
  let component: ClientCardComponent;
  let fixture: ComponentFixture<ClientCardComponent>;
  let apiService: jasmine.SpyObj<ApiService>;


  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getAccountsByClient']);
    
    await TestBed.configureTestingModule({
      imports: [
        ClientCardComponent,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ApiService, useValue: spy }
      ]
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiService.getAccountsByClient.and.returnValue(of(mockAccounts));

    fixture = TestBed.createComponent(ClientCardComponent);
    component = fixture.componentInstance;
    // to set input signal
    fixture.componentRef.setInput('client', mockClients[0]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Happy paths', () => {
    it('should load accounts when accordion is toggled', () => {
      component.toggleAccordion();
      fixture.detectChanges();
      expect(apiService.getAccountsByClient).toHaveBeenCalledWith(mockClients[0].id);
      expect(component.accounts()).toEqual(mockAccounts);
    });

    it('should not call the getAccountsByClient when the accordion is opened again', () => {
      component.toggleAccordion();
      fixture.detectChanges();
      component.toggleAccordion();
      fixture.detectChanges();
      expect(apiService.getAccountsByClient).toHaveBeenCalledTimes(1);
    });

    it('should initialize selected card types with all available types', () => {
      component.toggleAccordion();
      fixture.detectChanges();
      const uniqueTypes = new Set(mockAccounts.map(acc => acc.card_type));
      expect(component.selectedCardTypes()).toEqual(uniqueTypes);
    });

    it('should filter accounts by selected card type', () => {
      component.toggleAccordion();
      component.toggleCardType('VISA');
      const filtered = component.filteredAccounts();
      expect(filtered?.length).toBe(2);
      expect(filtered?.every(acc => acc.card_type === 'VISA')).toBeTrue();
    });

    it('should filter accounts by positive balance when positive pie chart section is clicked', () => {
      component.toggleAccordion();
      fixture.detectChanges();
      component.onPieChartSectionClick({ card_type: 'positive' });
      fixture.detectChanges();
      const filtered = component.filteredAccounts();
      expect(filtered?.every(acc => (acc.balance || 0) >= 0)).toBeTrue();
    });

    it('should filter accounts by negative balance when negative pie chart section is clicked', () => {
      component.toggleAccordion();
      fixture.detectChanges();
      component.onPieChartSectionClick({ card_type: 'negative' });
      fixture.detectChanges();
      const filtered = component.filteredAccounts();
      expect(filtered?.every(acc => (acc.balance || 0) < 0)).toBeTrue();
    });

    it('should reset all filters', () => {
      component.toggleAccordion();
      fixture.detectChanges();
      component.onPieChartSectionClick({ card_type: 'positive' });
      component.toggleCardType('VISA');
      component.resetFilters();
      
      expect(component.selectedBalanceType()).toBeNull();
      expect(component.selectedCardTypes()).toEqual(new Set(['VISA', 'MasterCard']));
    });

    it('should show accounts dialog when bar chart section is clicked', () => {
      component.toggleAccordion();
      fixture.detectChanges();
      component.onBarChartSectionClick({});
      expect(component.showDialog).toBeTrue();
    });

    it('should close accounts dialog', () => {
      component.showDialog = true;
      component.closeDialog();
      expect(component.showDialog).toBeFalse();
    });

    it('should group accounts by balance correctly', () => {
      component.toggleAccordion();
      fixture.detectChanges();
      const pieData = component.pieChartData();
      expect(pieData.length).toBe(2);
      expect(pieData[0].card_type).toBe('positive');
      expect(pieData[1].card_type).toBe('negative');
      expect(pieData[0].balance).toBe(2); // 2 positive accounts
      expect(pieData[1].balance).toBe(1); // 1 negative account
    });

    it('should show "More" button when there client has accounts', () => {
      component.toggleAccordion();
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('#more-button'));
      expect(button).toBeTruthy();
    });

    it('should not show "More" button when there are no accounts', () => {
      const newMock = {
            id: '3',
            firstname: 'John',
            name: 'Doe',
            address: '789 Pine St',
            birthday: '1990-01-01',
            created: '2024-01-01',
            accounts: []
        };
      fixture.componentRef.setInput('client', newMock);
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('#more-button'));
      expect(button).toBeFalsy();
    });

    it('should show the accordion when client has accounts', () => {
      component.toggleAccordion();
      fixture.detectChanges();
      const accordion = fixture.debugElement.query(By.css('.accordion'));
      expect(accordion).toBeTruthy();
    });

    it('should not show the accordion when client has no accounts', () => {
        const newMock = {
            id: '3',
            firstname: 'John',
            name: 'Doe',
            address: '789 Pine St',
            birthday: '1990-01-01',
            created: '2024-01-01',
            accounts: []
        };
      fixture.componentRef.setInput('client', newMock);
      fixture.detectChanges();
      const accordion = fixture.debugElement.query(By.css('.accordion'));
      expect(accordion).toBeFalsy();
    });

    it('should show the active badge when client has accounts', () => {
      const badgeValue = fixture.debugElement.query(By.css('.badge')).nativeElement.textContent;
      expect(badgeValue).toBe(' Active  2 ');
    });

    it('should show the number of accounts when client has accounts', () => {
      const badgeValue = fixture.debugElement.query(By.css('.number-badge')).nativeElement.textContent;
      expect(badgeValue).toBe(' 2 ');
    });
    
  });

  describe('Errors', () => {
    it('should handle API error when loading accounts', () => {
      apiService.getAccountsByClient.and.returnValue(throwError(() => new Error('API Error')));
      component.toggleAccordion();
      fixture.detectChanges();
      expect(component.accounts()).toBeNull();
    });

    it('should handle null accounts in filtered accounts computation', () => {
      component.accounts.set(null);
      expect(component.filteredAccounts()).toBeNull();
    });

  });
});