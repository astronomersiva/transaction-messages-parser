import getDate from '../utils/getDate.js';
import Engine from './_Engine.js';

import { TransactionData, Account, AccountType } from '../types.js';

export default class AxisCard extends Engine {
  protected getAccountDetails(): Account {
    const creditCardNumber = /Transaction alert on Axis Bank Credit Card no\. (XX\d{4})/.exec(this.message)?.[1] || null;

    return {
      number: creditCardNumber,
      type: AccountType.CARD,
    };
  }

  protected getTransactionDetails(): TransactionData {
    const [currency, _amount] = /Card no\. XX\d{4} for (\w{3}) (\d+(\.\d+)?)/.exec(this.message)?.slice(1) || ['INR', null];
    const amount = _amount ? parseFloat(_amount) : null;

    const [merchant, _date] = /Card no. XX\d{4} for \w{3} \d+(\.\d+)? at (.+?) on (\d{2}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/.exec(this.message)?.slice(2) || [null, null];
    const date = _date ? getDate(_date.split(' ').join(':')) : null;

    const type = 'debit'; // todo: refund transaction emails aren't sent by axis based on my email search

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
