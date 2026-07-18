-- Database Indexes for Performance

-- Investors indexes
CREATE INDEX idx_investors_email ON investors(email);
CREATE INDEX idx_investors_status ON investors(status);
CREATE INDEX idx_investors_created_at ON investors(created_at);

-- Contracts indexes
CREATE INDEX idx_contracts_investor_id ON contracts(investor_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_contract_number ON contracts(contract_number);
CREATE INDEX idx_contracts_created_at ON contracts(created_at);

-- Chart of Accounts indexes
CREATE INDEX idx_chart_of_accounts_number ON chart_of_accounts(account_number);
CREATE INDEX idx_chart_of_accounts_type ON chart_of_accounts(account_type);
CREATE INDEX idx_chart_of_accounts_active ON chart_of_accounts(is_active);

-- Journal Entries indexes
CREATE INDEX idx_journal_entries_number ON journal_entries(entry_number);
CREATE INDEX idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX idx_journal_entries_status ON journal_entries(status);
CREATE INDEX idx_journal_entries_created_at ON journal_entries(created_at);

-- Journal Entry Details indexes
CREATE INDEX idx_journal_entry_details_entry ON journal_entry_details(journal_entry_id);
CREATE INDEX idx_journal_entry_details_account ON journal_entry_details(account_id);

-- Receipts indexes
CREATE INDEX idx_receipts_number ON receipts(receipt_number);
CREATE INDEX idx_receipts_investor ON receipts(investor_id);
CREATE INDEX idx_receipts_date ON receipts(receipt_date);
CREATE INDEX idx_receipts_status ON receipts(status);
CREATE INDEX idx_receipts_created_at ON receipts(created_at);

-- Payments indexes
CREATE INDEX idx_payments_number ON payments(payment_number);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- Profit Distributions indexes
CREATE INDEX idx_profit_distributions_date ON profit_distributions(distribution_date);
CREATE INDEX idx_profit_distributions_status ON profit_distributions(status);

-- Profit Distribution Details indexes
CREATE INDEX idx_profit_distribution_details_dist ON profit_distribution_details(distribution_id);
CREATE INDEX idx_profit_distribution_details_investor ON profit_distribution_details(investor_id);

-- Audit Logs indexes
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
