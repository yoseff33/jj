import { useParams } from 'react-router-dom'
import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import Loading from '../../components/ui/Loading'
import Card from '../../components/ui/Card'

export default function InvestorDetails() {
  const { id } = useParams<{ id: string }>()
  const { data: investors, loading } = useSupabaseQuery('investors', { id })
  const investor = investors?.[0]

  if (loading) return <Loading />
  if (!investor) return <div>لم يتم العثور على المستثمر</div>

  return (
    <div className="max-w-2xl mx-auto rtl">
      <h1 className="text-2xl font-bold mb-6">تفاصيل المستثمر</h1>

      <Card title="معلومات المستثمر">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">الاسم</label>
              <p className="text-lg font-semibold">{investor.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">البريد الإلكتروني</label>
              <p className="text-lg font-semibold">{investor.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">الهاتف</label>
              <p className="text-lg font-semibold">{investor.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">المبلغ المستثمر</label>
              <p className="text-lg font-semibold">₪{investor.investment_amount?.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">العنوان</label>
              <p className="text-lg font-semibold">{investor.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">الحالة</label>
              <p className={`text-lg font-semibold ${
                investor.status === 'active' ? 'text-green-600' : 'text-red-600'
              }`}>
                {investor.status === 'active' ? 'نشط' : 'غير نشط'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
