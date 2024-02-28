import HDFCCard from './_HDFCCard.js';

import { TransactionData } from '../types.js';

/*
  Rs.1500 spent on HDFC Bank Card x0613 at NEELKANTH PETROLEUM on 2024-02-17:06:59:46 Avl bal: 123456.06.Not You? Call 18002586161 / SMS BLOCK DC 0613 to 7308080808
  Rs.2500 withdrawn from HDFC Bank Card x0613 at ABC CORP CAPTIVE on 2024-02-16:19:07:26 Avl bal: 12345.06.Not You? Call 18002586161/SMS BLOCK DC 0613 to 7308080808
*/

export default class HDFCDebitCard extends HDFCCard {
  protected getTransactionDetails(): TransactionData {
    const merchant = /at\s(.+?)\son/gi.exec(this.message)?.[1] || /By\s(.+?)\son/gi.exec(this.message)?.[1] || null;

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
