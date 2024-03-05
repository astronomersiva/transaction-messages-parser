import Engine from './_Engine.js';
import { formatDateStringWithMonth } from '../utils/formatDate.js';

import { TransactionData, Account, AccountType } from '../types.js';

export default class ICICIUPI extends Engine {
  protected getAccountDetails(): Account {
    const accountNumber = /\bICICI\sBank\sAcct\s(XX\d{3})/.exec(this.message)?.[1]
      || /Acct\s(XX\d{3})\sis\scredited/.exec(this.message)?.[1]
      || null;

    return {
      number: accountNumber,
      type: AccountType.UPI,
    };
  }

  protected getTransactionDetails(): TransactionData {
    const _date = this.message.match(/\d{2}-\w{3}-\d{2}/gi)?.[0] || '';
    const date = formatDateStringWithMonth(_date);

    const type = this.message.includes('debited for') ? 'debit' : 'credit';
    let merchant = null;

    if (type === 'debit') {
      merchant = /;\s(.+)\s\bcredited\./.exec(this.message)?.[1] || null;
    } else {
      merchant = /from\s(.+)\.\sUPI/.exec(this.message)?.[1] || null;
    }

    const currency = 'INR'; // hardcoded for now as I dont think foreign UPI txns are something I need to worry about
    const _amount = /Rs\s(\d+\.\d{2})/.exec(this.message)?.[1] || null;
    const amount = _amount ? parseFloat(_amount) : null;

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
