import { Transaction } from './types.js';

import Parser from './parser.js';

export const getTransactionData = async function (message: string): Promise<Transaction | null> {
  const parser = new Parser(message);
  return await parser.parseMessage();
}
