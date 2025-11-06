<script>
// Replace sample questions with your own (25–50 per test)
// Structure: Each level has an array of tests; each test has title, negative (bool), questions[]
window.QUESTION_BANK={
  foundation:[{
    title:'Foundation – Accounting Basics (Demo)', negative:false,
    questions:[
      {text:'Which concept assumes the business will continue indefinitely?',options:['Accrual','Going Concern','Consistency','Matching'],answer:1},
      {text:'Purchase returns are recorded in:',options:['Sales book','Purchase return book','Cash book','Journal proper'],answer:1},
      {text:'Revenue is recognized when it is:',options:['Received in cash','Earned','Billed','Collected'],answer:1},
      {text:'Debit what comes in, credit what goes out applies to:',options:['Nominal a/c','Real a/c','Personal a/c','Both a and b'],answer:1},
      {text:'Drawings are shown on:',options:['Assets side','Liabilities side','Debit of P&L','Credit of P&L'],answer:2}
    ]
  }],
  inter:[{
    title:'Inter – Costing Set 1', negative:true,
    questions:[
      {text:'In process costing, normal loss is:',options:['Abnormal','Uncontrollable','Expected','Avoidable'],answer:2},
      {text:'EOQ formula is:',options:['\u221a(2DS/H)','2DS/H','DS/2H','2H/DS'],answer:0},
      {text:'Variance that measures difference in actual vs standard price is:',options:['Usage variance','Yield variance','Material price variance','Mix variance'],answer:2}
    ]
  }],
  final:[{
    title:'Final – Audit & Ethics Set 1', negative:true,
    questions:[
      {text:'SA 700 relates to:',options:['Audit sampling','Forming an opinion and reporting','Quality control','Analytical procedures'],answer:1},
      {text:'Professional skepticism means:',options:['Trust management','Critical assessment of audit evidence','Ignore inconsistencies','Rely on prior audits'],answer:1},
      {text:'CARO applies to:',options:['All entities','Certain companies as prescribed','Only banks','Only listed co.'],answer:1}
    ]
  }]
};
</script>
