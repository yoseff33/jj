-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profit_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies for investors (Public read, authenticated write)
CREATE POLICY "Allow public read on investors" ON investors
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert on investors" ON investors
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on investors" ON investors
  FOR UPDATE USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for journal entries (Authenticated only)
CREATE POLICY "Allow authenticated access to journal_entries" ON journal_entries
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for audit logs (Read-only for authenticated users)
CREATE POLICY "Allow authenticated read on audit_logs" ON audit_logs
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policies for receipts and payments (Authenticated only)
CREATE POLICY "Allow authenticated access to receipts" ON receipts
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access to payments" ON payments
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Policies for profit distributions
CREATE POLICY "Allow authenticated access to profit_distributions" ON profit_distributions
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
