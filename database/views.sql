-- Database Views for Reports and Analytics

-- Trial Balance View
CREATE OR REPLACE VIEW trial_balance AS
SELECT 
  ca.account_number,
  ca.account_name,
  ca.account_type,
  ca.account_class,
  COALESCE(SUM(jed.debit), 0) as total_debit,
  COALESCE(SUM(jed.credit), 0) as total_credit,
  COALESCE(SUM(jed.debit), 0) - COALESCE(SUM(jed.credit), 0) as balance
FROM chart_of_accounts ca
LEFT JOIN journal_entry_details jed ON ca.id = jed.account_id
GROUP BY ca.id, ca.account_number, ca.account_name, ca.account_type, ca.account_class;

-- Income Statement View
CREATE OR REPLACE VIEW income_statement AS
SELECT 
  ca.account_number,
  ca.account_name,
  ca.account_type,
  COALESCE(SUM(jed.credit), 0) as revenue,
  COALESCE(SUM(jed.debit), 0) as expense
FROM chart_of_accounts ca
LEFT JOIN journal_entry_details jed ON ca.id = jed.account_id
WHERE ca.account_type IN ('Revenue', 'Expense')
GROUP BY ca.id, ca.account_number, ca.account_name, ca.account_type;

-- Balance Sheet View
CREATE OR REPLACE VIEW balance_sheet AS
SELECT 
  ca.account_number,
  ca.account_name,
  ca.account_type,
  ca.account_class,
  COALESCE(SUM(jed.debit), 0) - COALESCE(SUM(jed.credit), 0) as balance
FROM chart_of_accounts ca
LEFT JOIN journal_entry_details jed ON ca.id = jed.account_id
WHERE ca.account_type IN ('Asset', 'Liability', 'Equity')
GROUP BY ca.id, ca.account_number, ca.account_name, ca.account_type, ca.account_class;

-- General Ledger View
CREATE OR REPLACE VIEW general_ledger AS
SELECT 
  je.entry_date,
  je.entry_number,
  ca.account_number,
  ca.account_name,
  je.description,
  jed.debit,
  jed.credit,
  CASE 
    WHEN ca.account_type IN ('Asset', 'Expense') THEN COALESCE(jed.debit, 0) - COALESCE(jed.credit, 0)
    ELSE COALESCE(jed.credit, 0) - COALESCE(jed.debit, 0)
  END as balance
FROM journal_entries je
JOIN journal_entry_details jed ON je.id = jed.journal_entry_id
JOIN chart_of_accounts ca ON jed.account_id = ca.id
WHERE je.status = 'posted'
ORDER BY je.entry_date, je.entry_number;

-- Investor Summary View
CREATE OR REPLACE VIEW investor_summary AS
SELECT 
  i.id,
  i.name,
  i.email,
  i.phone,
  i.investment_amount,
  COUNT(DISTINCT c.id) as contract_count,
  COUNT(DISTINCT r.id) as receipt_count,
  COALESCE(SUM(r.amount), 0) as total_receipts
FROM investors i
LEFT JOIN contracts c ON i.id = c.investor_id
LEFT JOIN receipts r ON i.id = r.investor_id
GROUP BY i.id, i.name, i.email, i.phone, i.investment_amount;

-- Treasury Summary View
CREATE OR REPLACE VIEW treasury_summary AS
SELECT 
  COALESCE(SUM(CASE WHEN r.status = 'completed' THEN r.amount ELSE 0 END), 0) as total_receipts,
  COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) as total_payments,
  COALESCE(SUM(CASE WHEN r.status = 'completed' THEN r.amount ELSE 0 END), 0) - 
  COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) as net_cash
FROM receipts r
FULL OUTER JOIN payments p ON true;
