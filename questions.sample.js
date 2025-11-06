// ============================== questions.sample.js ============================== 
// Enhanced sample question bank with more questions and better structure

window.QUESTION_BANK = {
  foundation: [
    {
      title: 'CA Foundation – Accounting Basics (Demo)',
      negative: false,
      questions: [
        {
          text: 'Which accounting concept assumes that a business will continue to operate for the foreseeable future?',
          options: [
            'Accrual Concept',
            'Going Concern Concept',
            'Consistency Concept',
            'Matching Concept'
          ],
          answer: 1
        },
        {
          text: 'Purchase returns are recorded in which of the following books?',
          options: [
            'Sales Book',
            'Purchase Return Book',
            'Cash Book',
            'Journal Proper'
          ],
          answer: 1
        },
        {
          text: 'According to accounting principles, revenue should be recognized when:',
          options: [
            'Cash is received',
            'It is earned',
            'Invoice is issued',
            'Payment is collected'
          ],
          answer: 1
        },
        {
          text: 'The accounting rule "Debit what comes in, credit what goes out" applies to:',
          options: [
            'Nominal Accounts',
            'Real Accounts',
            'Personal Accounts',
            'Both Real and Nominal Accounts'
          ],
          answer: 1
        },
        {
          text: 'Drawings by the proprietor are shown on which side of the balance sheet?',
          options: [
            'Assets Side',
            'Liabilities Side',
            'Debit side of Profit & Loss Account',
            'Credit side of Profit & Loss Account'
          ],
          answer: 0
        },
        {
          text: 'Which of the following is not a current asset?',
          options: [
            'Cash in hand',
            'Inventory',
            'Building',
            'Debtors'
          ],
          answer: 2
        },
        {
          text: 'The basic accounting equation is:',
          options: [
            'Assets = Liabilities + Capital',
            'Assets = Liabilities - Capital',
            'Assets + Liabilities = Capital',
            'Assets = Capital - Liabilities'
          ],
          answer: 0
        }
      ]
    },
    {
      title: 'CA Foundation – Business Laws (Demo)',
      negative: true,
      questions: [
        {
          text: 'A contract without consideration is:',
          options: [
            'Valid',
            'Void',
            'Voidable',
            'Illegal'
          ],
          answer: 1
        },
        {
          text: 'The Indian Contract Act, 1872 came into force on:',
          options: [
            '1st September 1872',
            '1st October 1872',
            '1st November 1872',
            '1st December 1872'
          ],
          answer: 0
        },
        {
          text: 'An agreement not enforceable by law is said to be:',
          options: [
            'Valid',
            'Void',
            'Voidable',
            'Illegal'
          ],
          answer: 1
        }
      ]
    }
  ],
  
  inter: [
    {
      title: 'CA Inter – Advanced Accounting Set 1',
      negative: true,
      questions: [
        {
          text: 'In process costing, normal loss is:',
          options: [
            'Abnormal',
            'Uncontrollable',
            'Expected and inevitable',
            'Avoidable'
          ],
          answer: 2
        },
        {
          text: 'The formula for Economic Order Quantity (EOQ) is:',
          options: [
            '√(2DS/H)',
            '2DS/H',
            'DS/2H',
            '2H/DS'
          ],
          answer: 0
        },
        {
          text: 'The variance that measures the difference between actual price and standard price is:',
          options: [
            'Usage Variance',
            'Yield Variance',
            'Material Price Variance',
            'Mix Variance'
          ],
          answer: 2
        }
      ]
    }
  ],
  
  final: [
    {
      title: 'CA Final – Strategic Financial Management',
      negative: true,
      questions: [
        {
          text: 'The Capital Asset Pricing Model (CAPM) establishes the relationship between:',
          options: [
            'Risk and return of a security',
            'Risk and return of a portfolio',
            'Systematic risk and expected return',
            'Unsystematic risk and expected return'
          ],
          answer: 2
        },
        {
          text: 'In the Miller-Orr model, the return point is calculated as:',
          options: [
            'Upper limit + Lower limit / 2',
            '3 * Transaction cost * Variance / Interest rate',
            'Lower limit + Spread / 3',
            'Upper limit - Lower limit'
          ],
          answer: 2
        }
      ]
    },
    {
      title: 'CA Final – Audit & Ethics',
      negative: true,
      questions: [
        {
          text: 'SA 700 relates to:',
          options: [
            'Audit Sampling',
            'Forming an Opinion and Reporting on Financial Statements',
            'Quality Control for Audit of Financial Statements',
            'Analytical Procedures'
          ],
          answer: 1
        },
        {
          text: 'Professional skepticism in auditing means:',
          options: [
            'Trusting management representations',
            'Critical assessment of audit evidence',
            'Ignoring inconsistencies in evidence',
            'Relying solely on prior year audits'
          ],
          answer: 1
        },
        {
          text: 'CARO applies to:',
          options: [
            'All entities',
            'Certain companies as prescribed',
            'Only banking companies',
            'Only listed companies'
          ],
          answer: 1
        }
      ]
    }
  ]
};
