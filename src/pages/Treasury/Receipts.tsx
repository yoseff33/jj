import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'

export default function Receipts() {
  const { data: receipts, loading } = useSupabaseQuery('receipts')

  if (loading) return <Loading />

  const totalReceipts = receipts?.reduce((sum: number, r: any) => sum + (r.amount || 0), 0) || 0

  return (
    <div className="space-y-6 rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">الإيصالات</h1>
        <Link to="/treasury/receipts/new">
          <Button variant="primary">+ إيصال جديد</Button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">إجمالي الإيصالات</p>
        <p className="text-3xl font-bold text-green-600">﷼{totalReceipts.toLocaleString()}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-right">رقم الإيصال</th>
              <th className="border p-3 text-right">التاريخ</th>
              <th className="border p-3 text-right">المبلغ</th>
              <th className="border p-3 text-right">طريقة الدفع</th>
              <th className="border p-3 text-right">الحالة</th>
              <th className="border p-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {receipts?.map((receipt: any) => (
              <tr key={receipt.id} className="hover:bg-gray-50">
                <td className="border p-3">{receipt.receipt_number}</td>
                <td className="border p-3">{new Date(receipt.receipt_date).toLocaleDateString('ar-SA')}</td>
                <td className="border p-3 text-left">﷼{receipt.amount?.toLocaleString()}</td>
                <td className="border p-3">{receipt.payment_method}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    receipt.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {receipt.status === 'completed' ? 'مكتمل' : 'قيد الانتظار'}
                  </span>
                </td>
                <td className="border p-3">
                  <Link to={`/treasury/receipts/${receipt.id}/edit`}>
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
