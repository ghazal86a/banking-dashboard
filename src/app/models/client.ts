export interface Client {
    id: string;
    firstname?: string | null;
    name: string | null;
    address?: string | null;
    birthday?: string | null;
    created?: string | null;
    accounts?: string[] | null;
  }