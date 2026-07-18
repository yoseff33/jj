import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import Input from '../../components/ui/Input'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'

export default function InvestorsList() {
  const { data: investors, loading } = useSupabaseQuery('investors')
  const [searchTerm, setSearchTerm] = useState('')
  const [filtered, setFiltered] = useState<any[]>([])

  useEffect(() => {
    if (investors) {
      setFiltered(
        investors.filter((inv: any) =>
          inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inv.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [investors, searchTerm])

  if (loading) return <Loading />

  return (
    <div className="space-y-6 rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">المستثمرين</h1>
        <Link to="/investors/new">
          <Button variant="primary">+ إضافة مستثمر</Button>
        </Link>
      </div>

      <Input
        placeholder="البحث عن مستثمر..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-right">الاسم</th>
              <th className="border p-3 text-right">البريد الإلكتروني</th>
              <th className="border p-3 text-right">الهاتف</th>
              <th className="border p-3 text-right">المبلغ المستثمر</th>
              <th className="border p-3 text-right">الحالة</th>
              <th className="border p-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((investor: any) => (
              <tr key={investor.id} className="hover:bg-gray-50">
                <td className="border p-3">{investor.name}</td>
                <td className="border p-3">{investor.email}</td>
                <td className="border p-3">{investor.phone}</td>
                <td className="border p-3">₪{investor.investment_amount?.toLocaleString()}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    investor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {investor.status === 'active' ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className="border p-3">
                  <div className="flex gap-2">
                    <Link to={`/investors/${investor.id}`}>
                      <Button size="sm" variant="primary">عرض</Button>
                    </Link>
                    <Link to={`/investors/${investor.id}/edit`}>
                      <Button size="sm" variant="secondary">تعديل</Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
