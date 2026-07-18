-- Create tables for Fazaa ERP system

-- Investors table
CREATE TABLE IF NOT EXISTS investors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  investment_amount DECIMAL(15, 2),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
  contract_number VARCHAR(100) UNIQUE NOT NULL,
  contract_date DATE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  contract_type VARCHAR(100),
  terms TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chart of Accounts
CREATE TABLE IF NOT EXISTS chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_number VARCHAR(50) UNIQUE NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(100) NOT NULL,
  account_class VARCHAR(50),
  balance DECIMAL(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Journal Entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_number VARCHAR(100) UNIQUE NOT NULL,
  entry_date DATE NOT NULL,
  description TEXT,
  reference VARCHAR(255),
  total_debit DECIMAL(15, 2),
  total_credit DECIMAL(15, 2),
  status VARCHAR(50) DEFAULT 'draft',
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Journal Entry Details
CREATE TABLE IF NOT EXISTS journal_entry_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id UUID REFERENCES chart_of_accounts(id),
  debit DECIMAL(15, 2) DEFAULT 0,
  credit DECIMAL(15, 2) DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Receipts (Treasury)
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number VARCHAR(100) UNIQUE NOT NULL,
  receipt_date DATE NOT NULL,
  investor_id UUID REFERENCES investors(id),
  amount DECIMAL(15, 2) NOT NULL,
  payment_method VARCHAR(100),
  reference VARCHAR(255),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments (Treasury)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number VARCHAR(100) UNIQUE NOT NULL,
  payment_date DATE NOT NULL,
  payee_name VARCHAR(255) NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  payment_method VARCHAR(100),
  reference VARCHAR(255),
  notes TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Profit Distribution
CREATE TABLE IF NOT EXISTS profit_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribution_date DATE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_profit DECIMAL(15, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Profit Distribution Details
CREATE TABLE IF NOT EXISTS profit_distribution_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribution_id UUID REFERENCES profit_distributions(id) ON DELETE CASCADE,
  investor_id UUID REFERENCES investors(id),
  investment_amount DECIMAL(15, 2),
  profit_share DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action VARCHAR(255) NOT NULL,
  table_name VARCHAR(255),
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
