import Engine from './_Engine.js';
import formatICICIDate from '../utils/formatDateWithMonth.js';

import { TransactionData, Account, AccountType } from '../types.js';

// ICICI Bank Acct XX187 debited for Rs 123.00 on 28-Feb-24; SATHISHKUMAR PA credited. UPI:405981589407. Call 18002662 for dispute. SMS BLOCK 187 to 9215676766
// Dear Customer, Acct XX187 is credited with Rs 870.00 on 17-Oct-23 from Mr BALASURYA P. UPI:329009013172-ICICI Bank.
// Dear Customer, Acct XX187 is credited with Rs 2500.00 on 20-Jul-23 from S SRIKOWSIKAA. UPI:356714802995-ICICI Bank.

export default class ICICIUPI extends Engine {
  protected getAccountDetails(): Account {
    // UPI does not have name
    const accountName = null;

    const accountNumber = /\bICICI\sBank\sAcct\s(XX\d{3})/.exec(this.message)?.[1]
      || /Acct\s(XX\d{3})\sis\scredited/.exec(this.message)?.[1]
      || null;

    return {
      name: accountName,
      number: accountNumber,
      type: AccountType.UPI,
    };
  }

  protected getTransactionDetails(): TransactionData {
    const _date = this.message.match(/\d{2}-\w{3}-\d{2}/gi)?.[0] || '';
    const date = formatICICIDate(_date);

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
