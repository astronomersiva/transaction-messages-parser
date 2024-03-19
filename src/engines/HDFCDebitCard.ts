import HDFCCard from './_HDFCCard.js';

import { TransactionData } from '../types.js';

export default class HDFCDebitCard extends HDFCCard {
  protected getTransactionDetails(): TransactionData {
    const merchant = /\bat\s(.+?)\son/gi.exec(this.message)?.[1] || /By\s(.+?)\son/gi.exec(this.message)?.[1] || null;

    const _date = this.message.match(/\d{4}-\d{2}-\d{2}:?\d{2}:\d{2}:\d{2}/gi)?.[0] || '';
    const date = this.getDate(_date);

    const currency = 'INR'; // todo check if any FCY transaction messages include the currency
    const _amount = /Rs\.(\d+(\.\d+)?)/gi.exec(this.message)?.[1];
    const amount = _amount ? parseFloat(_amount) : null;

    const type = ['spent', 'withdrawn'].some((word) => this.message.includes(word)) ? 'debit' : 'credit';

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
