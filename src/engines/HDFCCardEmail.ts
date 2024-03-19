import _getDate from '../utils/getDate.js';
import Engine from './_Engine.js';

import { TransactionData, Account, AccountType } from '../types.js';

export default class HDFCCard extends Engine {
  protected getAccountDetails(): Account {
    const creditCardNumber = this.message.match(/ending\s(\d{4})/)?.[1] || '';

    return {
      number: creditCardNumber,
      type: AccountType.CARD,
    };
  }

  protected getDate(dateString: string): string | null {
    if (!dateString) return null;

    const [datePart, timePart] = dateString.split(' ');
    return _getDate(`${datePart}:${timePart}`);
  }

  protected getTransactionDetails(): TransactionData {
    const merchant = /\bat\s(.+?)\son/gi.exec(this.message)?.[1]
      || /from\s(.+?)\sto/gi.exec(this.message)?.[1]
      || null;

    const _date = /(\d{2}-\d{2}-\d{4}\s\d{2}:\d{2}:\d{2})/.exec(this.message)?.[1] || '';
    const date = this.getDate(_date);

    const currency = 'INR'; // all emails have only Rs. as currency
    const _amount = /Rs\s(\d+\.\d{2})/.exec(this.message)?.[1] || null;
    const amount = _amount ? parseFloat(_amount) : null;

    const type = /^We're pleased to inform you that a transaction reversal has been initiated/.test(this.message) ? 'credit' : 'debit';

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
