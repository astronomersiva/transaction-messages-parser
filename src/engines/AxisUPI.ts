import getDate from '../utils/getDate.js';
import Engine from './_Engine.js';

import { TransactionData, Account, AccountType } from '../types.js';

export default class AxisUPI extends Engine {
  #isCredit(): boolean {
    return this.message.includes('credited to A/c no');
  }

  #getCreditAccountDetails(): Account {
    const accountNumber = /\bcredited\sto\sA\/c\sno\.\s(X{2}\d{4})/.exec(this.message)?.[1] || null;

    return {
      number: accountNumber,
      type: AccountType.UPI,
    };
  }

  protected getAccountDetails(): Account {
    if (this.#isCredit()) {
      return this.#getCreditAccountDetails();
    }

    const accountNumber = this.message.split('\n')[2].split(' ')[2];

    return {
      number: accountNumber,
      type: AccountType.UPI,
    };
  }

  #getCreditTransactionDetails(): TransactionData {
    const splitMessage = this.message.split(' ');

    const currency = splitMessage[0];
    const amount = parseFloat(splitMessage[1]);
    const date = getDate(`${splitMessage[8]}:${splitMessage[10]}`);
    const merchant = /UPI\/P2[AM]\/\d+\/(.+)\s-\sAxis\sBank/.exec(this.message)?.[1] || null;
    const type = 'credit';

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }

  protected getTransactionDetails(): TransactionData {
    if (this.#isCredit()) {
      return this.#getCreditTransactionDetails();
    }

    const messageLines = this.message.split('\n');

    const currency = messageLines[1].split(' ')[0];
    const amount = parseFloat(messageLines[1].split(' ')[1]);

    const _date = messageLines[3].split(' ').join(':');
    const date = getDate(_date);

    const merchant = messageLines[4].split('/')[3];

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
