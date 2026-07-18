import { useState } from 'react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Loading from '../../components/ui/Loading'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import { supabase } from '../../lib/supabaseClient'

export default function ChartOfAccounts() {
  const { data: accounts, loading } = useSupabaseQuery('chart_of_accounts')
  const [isAdding, setIsAdding] = useState(false)
  const [newAccount, setNewAccount] = useState({
    account_number: '',
    account_name: '',
    account_type: 'Asset',
    account_class: 'Current',
  })

  const handleAddAccount = async () => {
    try {
      await supabase.from('chart_of_accounts').insert([newAccount])
      setNewAccount({ account_number: '', account_name: '', account_type: 'Asset', account_class: 'Current' })
      setIsAdding(false)
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-6 rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">دليل الحسابات</h1>
        <Button onClick={() => setIsAdding(!isAdding)} variant="primary">
          + إضافة حساب
        </Button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <Input
            label="رقم الحساب"
            value={newAccount.account_number}
            onChange={(e) => setNewAccount({...newAccount, account_number: e.target.value})}
            placeholder="1000"
          />
          <Input
            label="اسم الحساب"
            value={newAccount.account_name}
            onChange={(e) => setNewAccount({...newAccount, account_name: e.target.value})}
          />
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={newAccount.account_type}
            onChange={(e) => setNewAccount({...newAccount, account_type: e.target.value})}
          >
            <option value="Asset">الأصول</option>
            <option value="Liability">الالتزامات</option>
            <option value="Equity">حقوق الملكية</option>
            <option value="Revenue">الإيرادات</option>
            <option value="Expense">المصروفات</option>
          </select>
          <div className="flex gap-4">
            <Button onClick={handleAddAccount} variant="primary">حفظ</Button>
            <Button onClick={() => setIsAdding(false)} variant="secondary">إلغاء</Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-right">رقم الحساب</th>
              <th className="border p-3 text-right">اسم الحساب</th>
              <th className="border p-3 text-right">نوع الحساب</th>
              <th className="border p-3 text-right">فئة الحساب</th>
              <th className="border p-3 text-right">الرصيد</th>
            </tr>
          </thead>
          <tbody>
            {accounts?.map((account: any) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="border p-3">{account.account_number}</td>
                <td className="border p-3">{account.account_name}</td>
                <td className="border p-3">{account.account_type}</td>
                <td className="border p-3">{account.account_class}</td>
                <td className="border p-3 text-left">﷼{account.balance?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
