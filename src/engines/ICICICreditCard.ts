import Engine from './_Engine.js';
import formatDateWithMonth from '../utils/formatDateWithMonth.js';

import { TransactionData, Account, AccountType } from '../types.js';

// INR 1,516.00 spent on ICICI Bank Card XX4000 on 21-Feb-24 at IND*Amazon.
//  Avl Lmt: INR 1,23,456.00. To dispute,call 18002662/SMS BLOCK 4000 to 9215676766

export default class ICICICreditCard extends Engine {
  protected getAccountDetails(): Account {
    // messages do not have the card name
    const accountName = null;

    const creditCardNumber = this.message.match(/x(x)?\d{4}/gi)?.[0] || null;

    return {
      name: accountName,
      number: creditCardNumber,
      type: AccountType.CARD,
    };
  }

  protected getTransactionDetails(): TransactionData {
    const merchant = /\bat\s(.*)\.\sAvl\sLmt/i.exec(this.message)?.[1] || null;

    const _date = this.message.match(/\d{2}-\w{3}-\d{2}/gi)?.[0] || '';
    const date = formatDateWithMonth(_date);

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
