// Hi, salary of INR 1,23,456.78 is credited to HDFC Bank A/c XX5913. Avl bal: INR 1,1234.23.Chat on WhatsApp Banking, click:hdfcbk.io/k/DUvfE8hRogl
// Hi, salary of INR 12,345.00 is credited to HDFC Bank A/c XX5913. Avl bal: INR 1,23,456.23.Chat on WhatsApp Banking, click:hdfcbk.io/k/DUvfE8hRogl

// Update! INR 50,000.00 deposited in HDFC Bank A/c XX5913 on 03-DEC-23 for NEFT Cr-SBIN0002233-AYYAPPAN A-SIVASUBRAMANYAM-SBIN523337703618.Avl bal INR 1,23,456.78. Cheque deposits in A/C are subject to clearing
// Update! INR 12,345.00 deposited in HDFC Bank A/c XX5913 on 24-OCT-23 for NEFT Cr-YESB0000001-ZERODHA BROKING LTD-DSCNB A/C-AYYAPPAN SIVASUBRAMANYAM-YESB45912398987.Avl bal INR 1,23,456.78. Cheque deposits in A/C are subject to clearing

// Money Transferred - INR 3,121.00 from HDFC Bank A/c XX5913 on 05-02-23 to A/c xxxxxxxxxxx9426. (IMPS Ref No. 303617770015) Avl bal:INR 1,23,456.63 Not you? Call 18002586161

// Amount Deducted!
// Rs.3405 from your HDFC Bank A/c XX5913 for NEFT transaction via HDFC Bank Online Banking.
// Not you?Call 18002586161

// Amount Deducted!
// Rs.1933.5 from your HDFC Bank A/c XX5913 for Money Transfer via HDFC Bank Online Banking.
// Not you?Call 18002586161

// Money Sent-INR 15,000.00
// From HDFC Bank A/c XX5913 on 26-10-23
// To A/c xxxxxxxxxxx2621
// IMPS Ref-329920188389 
// Avl bal:INR 1,23,445.93
// Not you?Call 18002586161

// UPDATE: INR 5,000.00 debited from HDFC Bank XX5913 on 08-FEB-24. Info: ACH D- Groww Pay Services P-UKHLVY2QH9H9. Avl bal:INR 1,23,345.34

import Engine from './_Engine.js';
import getDate from '../utils/getDate.js';
import formatDateWithMonth from '../utils/formatDateWithMonth.js';

import { TransactionData, Account, AccountType, TransactionType } from '../types.js';

export default class HDFCBankTransfer extends Engine {
  protected getAccountDetails(): Account {
    const accountName = null;
    const accountNumber = /HDFC Bank A\/c\s(\x{1,2}\d{4})/i.exec(this.message)?.[1]
      || /from\sHDFC\sBank\s(x{1,2}\d{4})/i.exec(this.message)?.[1]
      || null;

    return {
      name: accountName,
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
      let _amount = this.message.split('\n')[0].split(' ')[2];
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
    }

    if (this.message.includes('deposited in')) {
      merchant = /\bCr-\w{11}-([\w\s]+)-\w{11}\./.exec(this.message)?.[1] || null;
    }

    if (this.message.startsWith('Money Transferred')) {
      merchant = /to\sA\/c\s(.*)\.\s\(/.exec(this.message)?.[1] || null;
    }

    if (this.message.startsWith('Money Sent')) {
      const merchantLines = this.message.split('\n')[2];
      merchant = merchantLines.split(' ')[2] || null;
    }

    if (this.message.startsWith('UPDATE')) {
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
      date = _date ? formatDateWithMonth(_date) : null;
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
