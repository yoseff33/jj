import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Loading from '../../components/ui/Loading'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'

export default function ContractsList() {
  const { data: contracts, loading } = useSupabaseQuery('contracts')

  if (loading) return <Loading />

  return (
    <div className="space-y-6 rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">العقود</h1>
        <Link to="/contracts/new">
          <Button variant="primary">+ إضافة عقد</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-right">رقم العقد</th>
              <th className="border p-3 text-right">تاريخ العقد</th>
              <th className="border p-3 text-right">نوع العقد</th>
              <th className="border p-3 text-right">الحالة</th>
              <th className="border p-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {contracts?.map((contract: any) => (
              <tr key={contract.id} className="hover:bg-gray-50">
                <td className="border p-3">{contract.contract_number}</td>
                <td className="border p-3">{new Date(contract.contract_date).toLocaleDateString('ar-SA')}</td>
                <td className="border p-3">{contract.contract_type}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    contract.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contract.status === 'active' ? 'نشط' : 'منتهي'}
                  </span>
                </td>
                <td className="border p-3">
                  <Link to={`/contracts/${contract.id}/edit`}>
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
