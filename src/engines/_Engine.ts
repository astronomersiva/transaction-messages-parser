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

    return transaction;
  }
}
