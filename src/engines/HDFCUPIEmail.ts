import getDate from '../utils/getDate.js';
import Engine from './_Engine.js';

import { TransactionData, Account, AccountType } from '../types.js';

export default class HDFCUPI extends Engine {
  protected getAccountDetails(): Account {
    const accountNumber = /from\saccount\s(\*{1,2}\d{4})/i.exec(this.message)?.[1]
      || /HDFC\sBank\sRuPay\sCredit\sCard\s(X{1,2}\d{4})/i.exec(this.message)?.[1]
      || null;

    return {
      number: accountNumber,
      type: AccountType.UPI,
    };
  }

  #getMerchant(): string | null {
    const merchant = /\bVPA\s(.*)\son/.exec(this.message)?.[1]
      || /X{1,2}\d{4}\sto\s(.*)\son/.exec(this.message)?.[1]
      || null;

    return merchant;
  }

  #getDate(): string | null {
    const _date = /(\d{2}-\d{2}(-\d{2})?)/gi.exec(this.message)?.[1];
    return getDate(_date);
  }

  protected getTransactionDetails(): TransactionData {
    const date = this.#getDate();
    const type = 'debit'; // HDFC UPI mails are always debits
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
