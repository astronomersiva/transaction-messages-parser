import getDate from '../utils/getDate.js';
import Engine from './_Engine.js';

import { TransactionData, Account, AccountType } from '../types.js';

/*
  Spent
  Card no. XX5489
  INR 25383
  31-01-24 20:05:04
  DREAMPLUG T
  Avl Lmt INR 12345.6
  SMS BLOCK 5489 to 919951860002, if not you - Axis Bank
*/

export default class AxisCard extends Engine {
  protected getAccountDetails(): Account {
    // messages do not have the card name
    const accountName = null;

    const creditCardNumber = this.message.split('\n')[1].split(' ')[2];

    return {
      name: accountName,
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
