import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'

export default function Payments() {
  const { data: payments, loading } = useSupabaseQuery('payments')

  if (loading) return <Loading />

  const totalPayments = payments?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0

  return (
    <div className="space-y-6 rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">المدفوعات</h1>
        <Link to="/treasury/payments/new">
          <Button variant="primary">+ دفعة جديدة</Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">إجمالي المدفوعات</p>
        <p className="text-3xl font-bold text-red-600">﷼{totalPayments.toLocaleString()}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-right">رقم الدفعة</th>
              <th className="border p-3 text-right">التاريخ</th>
              <th className="border p-3 text-right">المستفيد</th>
              <th className="border p-3 text-right">المبلغ</th>
              <th className="border p-3 text-right">طريقة الدفع</th>
              <th className="border p-3 text-right">الحالة</th>
              <th className="border p-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((payment: any) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="border p-3">{payment.payment_number}</td>
                <td className="border p-3">{new Date(payment.payment_date).toLocaleDateString('ar-SA')}</td>
                <td className="border p-3">{payment.payee_name}</td>
                <td className="border p-3 text-left">﷼{payment.amount?.toLocaleString()}</td>
                <td className="border p-3">{payment.payment_method}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                  </span>
                </td>
                <td className="border p-3">
                  <Link to={`/treasury/payments/${payment.id}/edit`}>
                    <Button size="sm" variant="secondary">تعديل</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
