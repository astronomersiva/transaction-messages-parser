# transaction-messages-parser

This is a WIP project to parse transaction messages(email and SMS) from different banks and extract the relevant information from them.

### Currently supported banks/institutions:

- [x] American Express
  - [x] Credit Card
- [ ] AU Small Finance Bank
  - [x] Credit Card
- [x] Axis Bank
  - [x] Credit Card - **SMS and Email**
  - [x] Debit Card
  - [x] Savings Account
  - [x] UPI
- [x] HDFC Bank
  - [x] Credit Card - **SMS and Email**
  - [x] Debit Card - **SMS and Email**
  - [x] Savings Account
  - [x] UPI - **SMS and Email**
- [x] ICICI Bank
  - [x] Credit Card
  - [ ] Debit Card
  - [ ] Savings Account
  - [x] UPI

### Usage

```javascript
import { getTransactionData } from 'transaction-messages-parser';

const message = 'HDFC Bank: Rs. 11.00 credited to a/c XXXXXX1234 on 20-02-24 by a/c linked to VPA goog-payment@okaxis (UPI Ref No  123456789123).';

const transactionData = await getTransactionData(message);
console.log(transactionData);
```

### Contributing

If you would like to report an issue or request a new bank/institution to be supported, please create an issue with sample messages from the bank/institution.
