-- Database triggers

-- Trigger to update investors timestamp
CREATE TRIGGER investors_update_timestamp
BEFORE UPDATE ON investors
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger to update contracts timestamp
CREATE TRIGGER contracts_update_timestamp
BEFORE UPDATE ON contracts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger to update journal entries timestamp
CREATE TRIGGER journal_entries_update_timestamp
BEFORE UPDATE ON journal_entries
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger to update chart of accounts timestamp
CREATE TRIGGER chart_of_accounts_update_timestamp
BEFORE UPDATE ON chart_of_accounts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger to update receipts timestamp
CREATE TRIGGER receipts_update_timestamp
BEFORE UPDATE ON receipts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger to update payments timestamp
CREATE TRIGGER payments_update_timestamp
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger to update profit distributions timestamp
CREATE TRIGGER profit_distributions_update_timestamp
BEFORE UPDATE ON profit_distributions
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger to update users timestamp
CREATE TRIGGER users_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Trigger to log changes in audit logs
CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (action, table_name, record_id, old_values)
    VALUES ('DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (action, table_name, record_id, old_values, new_values)
    VALUES ('UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (action, table_name, record_id, new_values)
    VALUES ('INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply audit logging to key tables
CREATE TRIGGER audit_investors AFTER INSERT OR UPDATE OR DELETE ON investors
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_journal_entries AFTER INSERT OR UPDATE OR DELETE ON journal_entries
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();

CREATE TRIGGER audit_receipts AFTER INSERT OR UPDATE OR DELETE ON receipts
FOR EACH ROW EXECUTE FUNCTION audit_log_trigger();
