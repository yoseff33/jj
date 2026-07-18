import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import Loading from '../../components/ui/Loading'
import Card from '../../components/ui/Card'

export default function TrialBalance() {
  const { data: balances, loading } = useSupabaseQuery('trial_balance')

  if (loading) return <Loading />

  const totalDebit = balances?.reduce((sum: number, b: any) => sum + (b.total_debit || 0), 0) || 0
  const totalCredit = balances?.reduce((sum: number, b: any) => sum + (b.total_credit || 0), 0) || 0

  return (
    <div className="space-y-6 rtl">
      <h1 className="text-2xl font-bold">ميزان المراجعة</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-right">رقم الحساب</th>
              <th className="border p-3 text-right">اسم الحساب</th>
              <th className="border p-3 text-right">دائن</th>
              <th className="border p-3 text-right">مدين</th>
              <th className="border p-3 text-right">الرصيد</th>
            </tr>
          </thead>
          <tbody>
            {balances?.map((balance: any) => (
              <tr key={balance.id} className="hover:bg-gray-50">
                <td className="border p-3">{balance.account_number}</td>
                <td className="border p-3">{balance.account_name}</td>
                <td className="border p-3 text-left">﷼{balance.total_credit?.toLocaleString()}</td>
                <td className="border p-3 text-left">﷼{balance.total_debit?.toLocaleString()}</td>
                <td className="border p-3 text-left">
                  <span className={balance.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ﷼{balance.balance?.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td colSpan={2} className="border p-3 text-right">الإجمالي</td>
              <td className="border p-3 text-left">﷼{totalCredit.toLocaleString()}</td>
              <td className="border p-3 text-left">﷼{totalDebit.toLocaleString()}</td>
              <td className="border p-3"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
