export type CardType = 'VISA' | 'MasterCard' | 'American Express' | 'Proton';
export interface Account {
  id: string;
  card_type: CardType;
  number: number;
  balance: number;
  created: string;
} 