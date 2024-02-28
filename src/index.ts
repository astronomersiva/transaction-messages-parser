import { Transaction } from './types.js';

import Parser from './parser.js';

export const getTransactionData = async function (message: string): Promise<Transaction | null> {
  const parser = new Parser(message);
  const transaction = await parser.parseMessage();
  if (transaction?.account?.number) {
    transaction.account.number_formatted = transaction.account.number
      .replace(/x+/gi, 'x')
      .replace(/\*+/g, 'x');
  }
  return transaction;
}
