import _getDate from '../utils/getDate.js';
import Engine from './_Engine.js';

import { TransactionData, Account, AccountType } from '../types.js';

export default class HDFCCard extends Engine {
  protected getAccountDetails(): Account {
    const creditCardNumber = this.message.match(/x(x)?\d{4}/gi)?.[0] || null;

    return {
      number: creditCardNumber,
      type: AccountType.CARD,
    };
  }

  protected getDate(dateString: string): string | null {
    // format to dd-mm-yyyy:hh:mm:ss
    const parts = dateString.split('-').map(part => part.split(':')).flat();
    const normalisedParts = [parts[2], parts[1], parts[0], parts[3], parts[4], parts[5]];
    return _getDate(`${normalisedParts[0]}-${normalisedParts[1]}-${normalisedParts[2]}:${normalisedParts[3]}:${normalisedParts[4]}:${normalisedParts[5]}`);
  }

  protected getTransactionDetails(): TransactionData {
    const merchant = /at\s(.+?)\son/gi.exec(this.message)?.[1] || /By\s(.+?)\son/gi.exec(this.message)?.[1] || null;

    const _date = this.message.match(/\d{4}-\d{2}-\d{2}:?\d{2}:\d{2}:\d{2}/gi)?.[0] || '';
    const date = this.getDate(_date);

    const currency = 'INR'; // todo check if any FCY transaction messages include the currency
    const _amount = /Rs\.(\d+(\.\d+)?)/gi.exec(this.message)?.[1];
    const amount = _amount ? parseFloat(_amount) : null;

    const type = 'debit';

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
