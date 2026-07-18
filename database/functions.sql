-- Database functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate account balance
CREATE OR REPLACE FUNCTION calculate_account_balance(account_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  balance DECIMAL(15, 2);
BEGIN
  SELECT COALESCE(SUM(COALESCE(debit, 0)) - SUM(COALESCE(credit, 0)), 0)
  INTO balance
  FROM journal_entry_details
  WHERE account_id = $1;
  RETURN balance;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate investor profit share
CREATE OR REPLACE FUNCTION calculate_profit_share(
  investor_id UUID,
  total_profit DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  investor_investment DECIMAL(15, 2);
  total_investment DECIMAL(15, 2);
  profit_share DECIMAL(15, 2);
BEGIN
  SELECT investment_amount INTO investor_investment FROM investors WHERE id = investor_id;
  SELECT SUM(investment_amount) INTO total_investment FROM investors WHERE status = 'active';
  
  IF total_investment > 0 THEN
    profit_share := (investor_investment / total_investment) * total_profit;
  ELSE
    profit_share := 0;
  END IF;
  
  RETURN profit_share;
END;
$$ LANGUAGE plpgsql;
