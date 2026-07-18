import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import Loading from '../../components/ui/Loading'

export default function AuditLogs() {
  const { data: logs, loading } = useSupabaseQuery('audit_logs')

  if (loading) return <Loading />

  return (
    <div className="space-y-6 rtl">
      <h1 className="text-2xl font-bold">سجل التدقيق</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-right">التاريخ</th>
              <th className="border p-3 text-right">المستخدم</th>
              <th className="border p-3 text-right">الإجراء</th>
              <th className="border p-3 text-right">الجدول</th>
              <th className="border p-3 text-right">البيانات القديمة</th>
              <th className="border p-3 text-right">البيانات الجديدة</th>
            </tr>
          </thead>
          <tbody>
            {logs?.map((log: any) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="border p-3">{new Date(log.created_at).toLocaleString('ar-SA')}</td>
                <td className="border p-3">{log.user_id}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    log.action === 'INSERT' ? 'bg-green-100 text-green-800' :
                    log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="border p-3">{log.table_name}</td>
                <td className="border p-3 text-xs">{JSON.stringify(log.old_values).substring(0, 50)}...</td>
                <td className="border p-3 text-xs">{JSON.stringify(log.new_values).substring(0, 50)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
