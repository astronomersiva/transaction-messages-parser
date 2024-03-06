import getDate from '../utils/getDate.js';
import Engine from './_Engine.js';

import { TransactionData, Account, AccountType } from '../types.js';

export default class AxisCard extends Engine {
  protected getAccountDetails(): Account {
    const accountNumber = this.message.split('\n')[2].split(' ')[2];

    return {
      number: accountNumber,
      type: AccountType.ACCOUNT,
    };
  }

  protected getTransactionDetails(): TransactionData {
    const messageLines = this.message.split('\n');
    const currency = messageLines[1].split(' ')[0];

    const amount = parseFloat(messageLines[1].split(' ')[1]);

    const _date = messageLines[3].split(' ').join(':');
    const date = getDate(_date);

    const merchant = messageLines[4];

    const type = messageLines[0].toLowerCase() === 'debit' ? 'debit' : 'credit';

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
