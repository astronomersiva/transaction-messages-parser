import getDate from '../utils/getDate.js';
import Engine from './_Engine.js';

import { TransactionData, Account, AccountType } from '../types.js';

export default class AxisCard extends Engine {
  protected getAccountDetails(): Account {
    const creditCardNumber = this.message.split('\n')[1].split(' ')[2];

    return {
      number: creditCardNumber,
      type: AccountType.CARD,
    };
  }

  protected getTransactionDetails(): TransactionData {
    const messageLines = this.message.split('\n');
    const currency = messageLines[2].split(' ')[0];

    const amount = parseFloat(messageLines[2].split(' ')[1]);

    const _date = messageLines[3].split(' ').join(':');
    const date = getDate(_date);

    const merchant = messageLines[4];

    const type = messageLines[0].toLowerCase() === 'spent' ? 'debit' : 'credit';

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
