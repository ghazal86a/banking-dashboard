import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ApiService } from '../../services/api.service';
import { of } from 'rxjs';
import { Client } from '../../models/client';
import { Account } from '../../models/account';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mockAccounts } from '../../models/mocks/mockData';
import { mockClients } from '../../models/mocks/mockData';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ApiService', ['getClients', 'getAccountsByClient']);
    
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ApiService, useValue: spy }
      ]
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiService.getClients.and.returnValue(of(mockClients));
    apiService.getAccountsByClient.and.returnValue(of(mockAccounts));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients on init', () => {
    expect(apiService.getClients).toHaveBeenCalled();
    expect(component.clients()).toEqual(mockClients);
  });

  it('should filter clients by search term', () => {
    component.filterText.set('John');
    expect(component.filteredClients().length).toBe(1);
    expect(component.filteredClients()[0].firstname).toBe('John');
  });

  it('should show all clients when search term is empty', () => {
    component.filterText.set('');
    expect(component.filteredClients().length).toBe(mockClients.length);
  });

  it('should handle empty client list', () => {
    apiService.getClients.and.returnValue(of([]));
    
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.clients().length).toBe(0);
    expect(component.filteredClients().length).toBe(0);
    
    expect(apiService.getClients).toHaveBeenCalled();
  });


  it('should filter clients case-insensitively', () => {
    component.filterText.set('jOhN');
    expect(component.filteredClients().length).toBe(1);
    expect(component.filteredClients()[0].firstname).toBe('John');
  });

}); 