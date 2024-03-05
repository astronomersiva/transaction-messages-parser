/* eslint-disable no-cond-assign */

import Engine from './_Engine.js';
import getDate from '../utils/getDate.js';
import { formatDateStringWithMonth } from '../utils/formatDate.js';

import { TransactionData, Account, AccountType, TransactionType } from '../types.js';

export default class HDFCBankTransfer extends Engine {
  protected getAccountDetails(): Account {
    const accountNumber = /HDFC Bank A\/c\s(\x{1,2}\d{4})/i.exec(this.message)?.[1]
      || /from\sHDFC\sBank\s(x{1,2}\d{4})/i.exec(this.message)?.[1]
      || null;

    return {
      number: accountNumber,
      type: AccountType.ACCOUNT,
    };
  }

  #getTransactionType(): TransactionType {
    if (/(deposited in|credited to)/i.test(this.message)) {
      return 'credit';
    }

    return 'debit';
  }

  #getAmount(): number | null {
    let amount;

    if (this.message.startsWith('Money Sent')) {
      const _amount = this.message.split('\n')[0].split(' ')[2];
      return parseFloat(_amount.replace(/,/g, ''));
    } else if (amount = /INR\s([\d,]+\.\d{2})\sdeposited\sin/.exec(this.message)?.[1]) {
      return parseFloat(amount.replace(/,/g, ''));
    } else if (amount = /INR\s([\d,]+\.\d{2})\sis\scredited\sto/.exec(this.message)?.[1]) {
      return parseFloat(amount.replace(/,/g, ''));
    } else if (amount = /Rs\.?(\d+\.?\d*)\sfrom\syour\sHDFC\sbank/i.exec(this.message)?.[1]) {
      return parseFloat(amount);
    } else if (amount = /INR\s([\d,]+\.\d{2})\s(debited\s)?from/.exec(this.message)?.[1]) {
      return parseFloat(amount.replace(/,/g, ''));
    }

    return null;
  }

  #getMerchant(): string | null {
    let merchant = null;

    if (this.message.includes('salary of')) {
      merchant = 'Salary';
    } else if (this.message.includes('deposited in')) {
      merchant = /\bCr-\w{11}-([\s\w]+)-[\s\S\w]+-\w+\./.exec(this.message)?.[1] || null;
    } else if (this.message.startsWith('Money Transferred')) {
      merchant = /to\sA\/c\s(.*)\.\s\(/.exec(this.message)?.[1] || null;
    } else if (this.message.startsWith('Money Sent')) {
      const merchantLines = this.message.split('\n')[2];
      merchant = merchantLines.split(' ')[2] || null;
    } else if (this.message.startsWith('UPDATE')) {
      merchant = /\bInfo:\s(.+)-\w{12}\./.exec(this.message)?.[1] || null;
    }

    return merchant;
  }

  protected getTransactionDetails(): TransactionData {
    const type = this.#getTransactionType();

    let date = null;
    let _date = /(\d{2}-\d{2}(-\d{2})?)/gi.exec(this.message)?.[1];
    if (_date) {
      date = getDate(_date);
    } else {
      _date = /(\d{2}-\w{3}-\d{2})/gi.exec(this.message)?.[1];
      date = _date ? formatDateStringWithMonth(_date) : null;
    }

    const currency = 'INR'; // hardcode as I dont think NEFT/IMPS will have other currency(?)
    const amount = this.#getAmount();

    const merchant = this.#getMerchant();

    return {
      amount,
      currency,
      date,
      merchant,
      type,
    };
  }
}
