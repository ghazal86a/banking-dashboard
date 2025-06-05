import { Account } from "../account";
import { Client } from "../client";

export const mockClients: Client[] = [
    {
      id: '1',
      firstname: 'John',
      name: 'Smith',
      address: '123 Main St',
      birthday: '1990-01-01',
      created: '2024-01-01',
      accounts: ['1', '2']
    },
    {
      id: '2',
      firstname: 'Jane',
      name: 'Smith',
      address: '456 Oak St',
      birthday: '1992-02-02',
      created: '2024-01-02',
      accounts: ['3']
    }
  ];

  export const mockAccounts: Account[] = [
    {
      id: '1',
      number: 1001,
      balance: 1000,
      card_type: 'VISA',
      created: '2024-01-01'
    },
    {
      id: '2',
      number: 1002,
      balance: -500,
      card_type: 'MasterCard',
      created: '2024-01-01'
    },
    {
      id: '3',
      number: 1003,
      balance: 2000,
      card_type: 'VISA',
      created: '2024-01-01'
    }
  ];