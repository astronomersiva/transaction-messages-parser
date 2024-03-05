import Engine from './_Engine.js';
import { formatDateStringWithMonth } from '../utils/formatDate.js';

import { TransactionData, Account, AccountType } from '../types.js';

export default class ICICICreditCard extends Engine {
  protected getAccountDetails(): Account {
    const creditCardNumber = this.message.match(/x(x)?\d{4}/gi)?.[0] || null;

    return {
      number: creditCardNumber,
      type: AccountType.CARD,
    };
  }

  protected getTransactionDetails(): TransactionData {
    const merchant = /\bat\s(.*)\.\sAvl\sLmt/i.exec(this.message)?.[1] || null;

    const _date = this.message.match(/\d{2}-\w{3}-\d{2}/gi)?.[0] || '';
    const date = formatDateStringWithMonth(_date);

    const currency = this.message.split(' ')[0];
    const _amount = this.message.split(' ')[1].replace(/,/g, '');
    const amount = _amount ? parseFloat(_amount) : null;

    const type = this.message.includes('spent on') ? 'debit' : 'credit';

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
