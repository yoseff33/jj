import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import Loading from '../../components/ui/Loading'

export default function GeneralLedger() {
  const { data: ledger, loading } = useSupabaseQuery('general_ledger')

  if (loading) return <Loading />

  return (
    <div className="space-y-6 rtl">
      <h1 className="text-2xl font-bold">الأستاذ العام</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-right">التاريخ</th>
              <th className="border p-3 text-right">رقم القيد</th>
              <th className="border p-3 text-right">رقم الحساب</th>
              <th className="border p-3 text-right">اسم الحساب</th>
              <th className="border p-3 text-right">البيان</th>
              <th className="border p-3 text-right">مدين</th>
              <th className="border p-3 text-right">دائن</th>
              <th className="border p-3 text-right">الرصيد</th>
            </tr>
          </thead>
          <tbody>
            {ledger?.map((entry: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border p-3">{new Date(entry.entry_date).toLocaleDateString('ar-SA')}</td>
                <td className="border p-3">{entry.entry_number}</td>
                <td className="border p-3">{entry.account_number}</td>
                <td className="border p-3">{entry.account_name}</td>
                <td className="border p-3">{entry.description}</td>
                <td className="border p-3 text-left">﷼{entry.debit?.toLocaleString()}</td>
                <td className="border p-3 text-left">﷼{entry.credit?.toLocaleString()}</td>
                <td className="border p-3 text-left">
                  <span className={entry.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ﷼{entry.balance?.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
