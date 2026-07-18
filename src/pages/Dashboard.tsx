import { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Loading from '../components/ui/Loading'
import BarChart from '../components/charts/BarChart'
import LineChart from '../components/charts/LineChart'
import { useSupabaseQuery } from '../hooks/useSupabaseQuery'

export default function Dashboard() {
  const { data: investors, loading: investorsLoading } = useSupabaseQuery('investors')
  const { data: receipts, loading: receiptsLoading } = useSupabaseQuery('receipts')
  const { data: payments, loading: paymentsLoading } = useSupabaseQuery('payments')

  const investorCount = investors?.length || 0
  const totalReceipts = receipts?.reduce((sum, r: any) => sum + (r.amount || 0), 0) || 0
  const totalPayments = payments?.reduce((sum, p: any) => sum + (p.amount || 0), 0) || 0
  const netCash = totalReceipts - totalPayments

  const chartData = [
    { month: 'يناير', receipts: 50000, payments: 30000 },
    { month: 'فبراير', receipts: 60000, payments: 35000 },
    { month: 'مارس', receipts: 55000, payments: 40000 },
    { month: 'أبريل', receipts: 70000, payments: 45000 },
    { month: 'مايو', receipts: 80000, payments: 50000 },
    { month: 'يونيو', receipts: 90000, payments: 55000 },
  ]

  if (investorsLoading || receiptsLoading || paymentsLoading) {
    return <Loading />
  }

  return (
    <div className="space-y-6 rtl">
      <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{investorCount}</div>
            <p className="text-gray-600 mt-2">عدد المستثمرين</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">₪{totalReceipts.toLocaleString()}</div>
            <p className="text-gray-600 mt-2">إجمالي الإيصالات</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-red-600">₪{totalPayments.toLocaleString()}</div>
            <p className="text-gray-600 mt-2">إجمالي المدفوعات</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className={`text-4xl font-bold ${netCash >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₪{netCash.toLocaleString()}
            </div>
            <p className="text-gray-600 mt-2">الرصيد النقدي</p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          data={chartData}
          xAxisKey="month"
          dataKey="receipts"
          title="الإيصالات الشهرية"
        />
        <LineChart
          data={chartData}
          xAxisKey="month"
          dataKey="payments"
          title="المدفوعات الشهرية"
        />
      </div>
    </div>
  )
}
