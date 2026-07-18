import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import InvestorsList from './pages/Investors/InvestorsList'
import InvestorForm from './pages/Investors/InvestorForm'
import InvestorDetails from './pages/Investors/InvestorDetails'
import InvestorStatement from './pages/Investors/InvestorStatement'
import ContractsList from './pages/Contracts/ContractsList'
import ContractForm from './pages/Contracts/ContractForm'
import ChartOfAccounts from './pages/Accounting/ChartOfAccounts'
import JournalEntries from './pages/Accounting/JournalEntries'
import JournalForm from './pages/Accounting/JournalForm'
import TrialBalance from './pages/Accounting/TrialBalance'
import IncomeStatement from './pages/Accounting/IncomeStatement'
import BalanceSheet from './pages/Accounting/BalanceSheet'
import GeneralLedger from './pages/Accounting/GeneralLedger'
import Receipts from './pages/Treasury/Receipts'
import ReceiptForm from './pages/Treasury/ReceiptForm'
import Payments from './pages/Treasury/Payments'
import PaymentForm from './pages/Treasury/PaymentForm'
import ProfitDistribution from './pages/Profits/ProfitDistribution'
import ProfitForm from './pages/Profits/ProfitForm'
import Reports from './pages/Reports/Reports'
import AuditLogs from './pages/Audit/AuditLogs'
import Users from './pages/Users/Users'
import Settings from './pages/Settings/Settings'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            
            {/* Investors Routes */}
            <Route path="/investors" element={<InvestorsList />} />
            <Route path="/investors/new" element={<InvestorForm />} />
            <Route path="/investors/:id" element={<InvestorDetails />} />
            <Route path="/investors/:id/edit" element={<InvestorForm />} />
            <Route path="/investors/:id/statement" element={<InvestorStatement />} />
            
            {/* Contracts Routes */}
            <Route path="/contracts" element={<ContractsList />} />
            <Route path="/contracts/new" element={<ContractForm />} />
            <Route path="/contracts/:id/edit" element={<ContractForm />} />
            
            {/* Accounting Routes */}
            <Route path="/accounting/chart" element={<ChartOfAccounts />} />
            <Route path="/accounting/journal-entries" element={<JournalEntries />} />
            <Route path="/accounting/journal-entries/new" element={<JournalForm />} />
            <Route path="/accounting/journal-entries/:id/edit" element={<JournalForm />} />
            <Route path="/accounting/trial-balance" element={<TrialBalance />} />
            <Route path="/accounting/income-statement" element={<IncomeStatement />} />
            <Route path="/accounting/balance-sheet" element={<BalanceSheet />} />
            <Route path="/accounting/general-ledger" element={<GeneralLedger />} />
            
            {/* Treasury Routes */}
            <Route path="/treasury/receipts" element={<Receipts />} />
            <Route path="/treasury/receipts/new" element={<ReceiptForm />} />
            <Route path="/treasury/receipts/:id/edit" element={<ReceiptForm />} />
            <Route path="/treasury/payments" element={<Payments />} />
            <Route path="/treasury/payments/new" element={<PaymentForm />} />
            <Route path="/treasury/payments/:id/edit" element={<PaymentForm />} />
            
            {/* Profits Routes */}
            <Route path="/profits" element={<ProfitDistribution />} />
            <Route path="/profits/new" element={<ProfitForm />} />
            <Route path="/profits/:id/edit" element={<ProfitForm />} />
            
            {/* Reports Routes */}
            <Route path="/reports" element={<Reports />} />
            
            {/* Audit Routes */}
            <Route path="/audit" element={<AuditLogs />} />
            
            {/* Admin Routes */}
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
