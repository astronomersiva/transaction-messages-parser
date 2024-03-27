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

    const transactionInfo: Transaction = {
      account,
      transaction: transactionData,
    };

    if (transactionInfo?.account?.number) {
      transactionInfo.account.number_formatted = transactionInfo.account.number
        .replace(/x+/gi, 'x')
        .replace(/\*+/g, 'x');
  
      if (!transactionInfo.account.number_formatted.startsWith('x')) {
        transactionInfo.account.number_formatted = `x${transactionInfo.account.number_formatted}`;
      }
    }

    if (transactionInfo?.transaction?.merchant) {
      transactionInfo.transaction.merchant = transactionInfo.transaction.merchant.trim();
    }

    return transactionInfo;
  }
}
