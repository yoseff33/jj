import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import Loading from '../../components/ui/Loading'
import Button from '../../components/ui/Button'

export default function Users() {
  const { data: users, loading } = useSupabaseQuery('users')

  if (loading) return <Loading />

  return (
    <div className="space-y-6 rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">المستخدمون</h1>
        <Button variant="primary">+ مستخدم جديد</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-right">الاسم</th>
              <th className="border p-3 text-right">البريد الإلكتروني</th>
              <th className="border p-3 text-right">الدور</th>
              <th className="border p-3 text-right">حالة النشاط</th>
              <th className="border p-3 text-right">آخر دخول</th>
              <th className="border p-3 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-3">{user.full_name}</td>
                <td className="border p-3">{user.email}</td>
                <td className="border p-3">{user.role}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'نشط' : 'معطل'}
                  </span>
                </td>
                <td className="border p-3">{user.last_login ? new Date(user.last_login).toLocaleDateString('ar-SA') : '-'}</td>
                <td className="border p-3">
                  <Button size="sm" variant="secondary">تعديل</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
