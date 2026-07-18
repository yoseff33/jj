-- Seed data for testing

-- Insert sample investors
INSERT INTO investors (name, email, phone, address, investment_amount, status) VALUES
('أحمد محمد', 'ahmed@example.com', '+966501234567', 'الرياض، السعودية', 100000, 'active'),
('فاطمة علي', 'fatima@example.com', '+966502234567', 'جدة، السعودية', 150000, 'active'),
('محمود حسن', 'mahmoud@example.com', '+966503234567', 'الدمام، السعودية', 200000, 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample chart of accounts
INSERT INTO chart_of_accounts (account_number, account_name, account_type, account_class) VALUES
('1000', 'النقد والبنك', 'Asset', 'Current'),
('1100', 'الذمم المدينة', 'Asset', 'Current'),
('2000', 'الذمم الدائنة', 'Liability', 'Current'),
('3000', 'رأس المال', 'Equity', 'Permanent'),
('4000', 'الإيرادات', 'Revenue', 'Temporary'),
('5000', 'المصروفات', 'Expense', 'Temporary')
ON CONFLICT (account_number) DO NOTHING;

-- Insert sample users
INSERT INTO users (email, full_name, role, is_active) VALUES
('admin@example.com', 'المسؤول', 'Admin', true),
('accountant@example.com', 'المحاسب', 'Accountant', true),
('viewer@example.com', 'المشاهد', 'Viewer', true)
ON CONFLICT (email) DO NOTHING;
