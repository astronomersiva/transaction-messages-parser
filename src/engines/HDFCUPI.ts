import getDate from '../utils/getDate.js';
import Engine from './_Engine.js';

import { TransactionData, Account, AccountType, TransactionType } from '../types.js';

export default class HDFCUPI extends Engine {
  protected getAccountDetails(): Account {
    const accountNumber = /A\/C\s(\*{1,2}\d{4})/i.exec(this.message)?.[1]
      || /From\sHDFC\sBank\sA\/C\s(\*\d{4})/i.exec(this.message)?.[1]
      || /a\/c\s(X{6}\d{4})/i.exec(this.message)?.[1]
      || null;

    return {
      number: accountNumber,
      type: AccountType.UPI,
    };
  }

  #getTransactionType(): TransactionType {
    const isCredit = /credited\sto\s/.test(this.message);
    return isCredit ? 'credit' : 'debit';
  }

  #getMerchant(): string | null {
    if (this.#getTransactionType() === 'credit') {
      return /linked\sto\sVPA\s(.*)\s\(/.exec(this.message)?.[1] || null;
    }

    const merchant = /\bTo\s(.*)\sOn/.exec(this.message)?.[1]
      || /\bto\s(.*)\sUPI:/.exec(this.message)?.[1]
      || null;

    return merchant;
  }

  #getDate(): string | null {
    const _date = /(\d{2}-\d{2}(-\d{2})?)/gi.exec(this.message)?.[1];
    return getDate(_date);
  }

  protected getTransactionDetails(): TransactionData {
    const date = this.#getDate();
    const type = this.#getTransactionType();
    const merchant = this.#getMerchant();

    const _amount = /Rs\.?\s?(\d+\.?\d+)/i.exec(this.message)?.[1] || null;
    const amount = _amount ? parseFloat(_amount) : null;

    const currency = 'INR'; // todo how does UPI handle FCY transactions? check with someone in UAE?

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
