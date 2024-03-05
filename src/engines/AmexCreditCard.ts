import Engine from './_Engine.js';

import { formatDateWithMonth } from '../utils/formatDate.js';
import { TransactionData, Account, AccountType } from '../types.js';

export default class AmexCreditCard extends Engine {
  protected getAccountDetails(): Account {
    const creditCardNumber = /AMEX card \*\* (\d+)/.exec(this.message)?.[1] || null;

    return {
      number: creditCardNumber,
      type: AccountType.CARD,
    };
  }

  #getDate(message: string): string | null {
    const _date = /on\s(\d+)\s(\w+),\s(\d{4})\sat\s(\w{2}):(\w{2})\s(AM|PM)/.exec(message);
    const isPM = _date?.[6] === 'PM';
    let hours;
    if (isPM) {
      hours = _date?.[4] === '12' ? '12' : (parseInt(_date?.[4] || '0') + 12).toString();
    } else {
      hours = _date?.[4] === '12' ? '00' : _date?.[4];
    }

    const date = formatDateWithMonth(_date?.[1] || '', _date?.[2] || '', _date?.[3] || '', hours, _date?.[5]);
    return date;
  }

  protected getTransactionDetails(): TransactionData {
    const currency = /spent\s([A-Z]{3})\s\d+/.exec(this.message)?.[1] || null;
    const _amount = /spent\s[A-Z]{3}\s([\d,]+\.\d{2})/.exec(this.message)?.[1] || '0';
    const amount = parseFloat(_amount.replace(/,/g, ''));

    const date = this.#getDate(this.message);

    const merchant = /at\s(.+?)\son/gi.exec(this.message)?.[1] || null;

    const type = /You've spent/.test(this.message) ? 'debit' : 'credit';

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
