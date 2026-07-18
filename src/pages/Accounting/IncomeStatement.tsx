import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import Loading from '../../components/ui/Loading'
import BarChart from '../../components/charts/BarChart'

export default function IncomeStatement() {
  const { data: statement, loading } = useSupabaseQuery('income_statement')

  if (loading) return <Loading />

  const revenues = statement?.filter((s: any) => s.account_type === 'Revenue') || []
  const expenses = statement?.filter((s: any) => s.account_type === 'Expense') || []
  const totalRevenue = revenues.reduce((sum: number, r: any) => sum + (r.revenue || 0), 0)
  const totalExpense = expenses.reduce((sum: number, e: any) => sum + (e.expense || 0), 0)
  const netIncome = totalRevenue - totalExpense

  const chartData = [
    { name: 'الإيرادات', value: totalRevenue },
    { name: 'المصروفات', value: totalExpense },
    { name: 'الصافي', value: netIncome },
  ]

  return (
    <div className="space-y-6 rtl">
      <h1 className="text-2xl font-bold">قائمة الدخل</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-2">إجمالي الإيرادات</p>
          <p className="text-3xl font-bold text-green-600">﷼{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-2">إجمالي المصروفات</p>
          <p className="text-3xl font-bold text-red-600">﷼{totalExpense.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-600 mb-2">الدخل الصافي</p>
          <p className={`text-3xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ﷼{netIncome.toLocaleString()}
          </p>
        </div>
      </div>

      <BarChart
        data={chartData}
        xAxisKey="name"
        dataKey="value"
        title="ملخص قائمة الدخل"
      />
    </div>
  )
}
