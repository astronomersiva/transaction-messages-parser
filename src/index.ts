import { Transaction } from './types.js';

import Parser from './parser.js';

export async function getTransactionData(message: string): Promise<Transaction | null> {
  const parser = new Parser(message);
  return await parser.parseMessage();
}
