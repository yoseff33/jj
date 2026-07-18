import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'

export default function JournalEntries() {
  const { data: entries, loading } = useSupabaseQuery('journal_entries')

  if (loading) return <Loading />

  return (
    <div className="space-y-6 rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">قيود اليوميات</h1>
        <Link to="/accounting/journal-entries/new">
          <Button variant="primary">+ قيد جديد</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-right">رقم القيد</th>
              <th className="border p-3 text-right">التاريخ</th>
              <th className="border p-3 text-right">الوصف</th>
              <th className="border p-3 text-right">الحالة</th>
              <th className="border p-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((entry: any) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="border p-3">{entry.entry_number}</td>
                <td className="border p-3">{new Date(entry.entry_date).toLocaleDateString('ar-SA')}</td>
                <td className="border p-3">{entry.description}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    entry.status === 'posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.status === 'posted' ? 'مرسل' : 'مسودة'}
                  </span>
                </td>
                <td className="border p-3">
                  <Link to={`/accounting/journal-entries/${entry.id}/edit`}>
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
