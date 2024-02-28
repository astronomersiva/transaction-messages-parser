export enum AccountType {
  CARD = 'card',
  ACCOUNT = 'account',
  UPI = 'upi',
}

export type TransactionType = 'debit' | 'credit';

export interface Account {
  name: string | null;
  number: string | null;
  number_formatted?: string | null;
  type: AccountType | null;
}

export interface TransactionData {
  amount: number | null;
  currency: string | null;
  date: string | null;
  merchant: string | null;
  type: TransactionType | null;
}

export interface Transaction {
  account: Account;
  transaction: TransactionData;
}
