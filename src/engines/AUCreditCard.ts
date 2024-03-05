import Engine from './_Engine.js';

import getDate from '../utils/getDate.js';
import { TransactionData, Account, AccountType } from '../types.js';

export default class AUCreditCard extends Engine {
  protected getAccountDetails(): Account {
    const creditCardNumber = /Credit Card (xx\d+)/.exec(this.message)?.[1] || null;

    return {
      number: creditCardNumber,
      type: AccountType.CARD,
    };
  }

  #getDate(message: string): string | null {
    const _date = /on\s(\d{2})-(\d{2})-(\d{4})\sat\s(\d{2}):(\d{2}):(\d{2})\s(am|pm)/.exec(message);
    const isPM = _date?.[7] === 'pm';
    let hours;
    if (isPM) {
      hours = _date?.[4] === '12' ? '12' : (parseInt(_date?.[4] || '0') + 12).toString();
    } else {
      hours = _date?.[4] === '12' ? '00' : _date?.[4];
    }

    const date = getDate(`${_date?.[1]}-${_date?.[2]}-${_date?.[3]}:${hours}:${_date?.[5]}`);
    return date;
  }

  protected getTransactionDetails(): TransactionData {
    const currency = /Alert!\s([\w]+)\s/.exec(this.message)?.[1] || null;
    const _amount = /([\d,]+\.?\d{0,2})\sspent/.exec(this.message)?.[1] || '0';
    const amount = parseFloat(_amount.replace(/,/g, ''));

    const date = this.#getDate(this.message);

    const merchant = /at\s(.+?)\son/gi.exec(this.message)?.[1] || null;

    const type = /spent/.test(this.message) ? 'debit' : 'credit';

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
