const ParsingEngines = [
  {
    engine: 'HDFCCreditCard',
    rule: [
      /On HDFC Bank CREDIT Card/,
      /hdfc bank card.*block cc/i,
    ]
  }, {
    engine: 'HDFCUPI',
    rule: [
      /\bFrom HDFC Bank[\s\S]*SMS BLOCK UPI/,
      /\bHDFC Bank.*a\/c linked to VPA/,
      /^Money Transfer:.*UPI:/
    ]
  }, {
    engine: 'HDFCDebitCard',
    rule: /hdfc bank card.*block dc/i,
  }, {
    engine: 'HDFCBankTransfer',
    rule: [
      /credited\sto\sHDFC\sBank/,
      /deposited\sin\sHDFC\sBank/,
      /^Money\sTransferred\s-\s/,
      /via\sHDFC\sBank\sOnline\sBanking/,
      /\nFrom\sHDFC\sBank\sA\/c/,
      /^UPDATE:.+debited\sfrom\sHDFC\sBank/,
    ],
  }, {
    engine: 'AxisUPI',
    rule: /UPI\/P2[MA]/,
  }, {
    engine: 'AxisCard',
    rule: /if not you - Axis Bank/,
  }, {
    engine: 'ICICICreditCard',
    rule: /ICICI Bank Card/,
  }, {
    engine: 'ICICIUPI',
    rule: [
      /\bICICI\sBank\sAcct.*UPI:\d{12}/,
      /\bDear\sCustomer,\sAcct\sXX\d{3}.*UPI:\d{12}-ICICI\sBank/
    ]
  }, {
    engine: 'AmexCreditCard',
    rule: /on your AMEX card/,
  }, {
    engine: 'AUCreditCard',
    rule: /spent on your AU Bank Credit Card/,
  }
]

export default function getEngine(message: string) {
  const parsingEngine = ParsingEngines.find((ParsingEngine) => {
    if (Array.isArray(ParsingEngine.rule)) {
      return ParsingEngine.rule.some((r) => r.test(message));
    }

    return ParsingEngine.rule.test(message);
  });

  if (parsingEngine) {
    return parsingEngine.engine;
  }

  return null;
}
