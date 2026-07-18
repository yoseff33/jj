import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'

export default function ProfitDistribution() {
  const { data: distributions, loading } = useSupabaseQuery('profit_distributions')

  if (loading) return <Loading />

  return (
    <div className="space-y-6 rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">توزيع الأرباح</h1>
        <Link to="/profits/new">
          <Button variant="primary">+ توزيع جديد</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-right">تاريخ التوزيع</th>
              <th className="border p-3 text-right">الفترة من</th>
              <th className="border p-3 text-right">إلى</th>
              <th className="border p-3 text-right">إجمالي الأرباح</th>
              <th className="border p-3 text-right">الحالة</th>
              <th className="border p-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {distributions?.map((dist: any) => (
              <tr key={dist.id} className="hover:bg-gray-50">
                <td className="border p-3">{new Date(dist.distribution_date).toLocaleDateString('ar-SA')}</td>
                <td className="border p-3">{new Date(dist.period_start).toLocaleDateString('ar-SA')}</td>
                <td className="border p-3">{new Date(dist.period_end).toLocaleDateString('ar-SA')}</td>
                <td className="border p-3 text-left">﷼{dist.total_profit?.toLocaleString()}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    dist.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {dist.status === 'completed' ? 'مكتمل' : 'مسودة'}
                  </span>
                </td>
                <td className="border p-3">
                  <Link to={`/profits/${dist.id}/edit`}>
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
