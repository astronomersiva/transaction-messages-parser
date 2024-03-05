import { TransactionData, Account, Transaction } from '../types.js';

export default abstract class Engine {
  protected message: string;

  constructor(msg: string) {
    this.message = msg;
  }

  protected abstract getAccountDetails(): Account;
  protected abstract getTransactionDetails(): TransactionData;

  public getTransaction(): Transaction {
    const account: Account = this.getAccountDetails();
    const transactionData: TransactionData = this.getTransactionDetails();

    const transaction: Transaction = {
      account,
      transaction: transactionData,
    };

    if (transaction?.account?.number) {
      transaction.account.number_formatted = transaction.account.number
        .replace(/x+/gi, 'x')
        .replace(/\*+/g, 'x');
  
      if (!transaction.account.number_formatted.startsWith('x')) {
        transaction.account.number_formatted = `x${transaction.account.number_formatted}`;
      }
    }

    return transaction;
  }
}
