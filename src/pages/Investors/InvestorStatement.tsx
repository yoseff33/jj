import { useParams } from 'react-router-dom'
import Card from '../../components/ui/Card'
import LineChart from '../../components/charts/LineChart'

export default function InvestorStatement() {
  const { id } = useParams<{ id: string }>()

  const mockData = [
    { month: 'يناير', profit: 5000, dividend: 2500 },
    { month: 'فبراير', profit: 6000, dividend: 3000 },
    { month: 'مارس', profit: 7000, dividend: 3500 },
    { month: 'أبريل', profit: 8000, dividend: 4000 },
    { month: 'مايو', profit: 9000, dividend: 4500 },
    { month: 'يونيو', profit: 10000, dividend: 5000 },
  ]

  return (
    <div className="space-y-6 rtl">
      <h1 className="text-2xl font-bold">بيان المستثمر</h1>

      <Card title="الأرباح والتوزيعات">
        <LineChart
          data={mockData}
          xAxisKey="month"
          dataKey="profit"
          title="الأرباح الشهرية"
        />
      </Card>

      <Card title="ملخص البيان">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">إجمالي الأرباح</label>
            <p className="text-2xl font-bold text-green-600">₪45,000</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">إجمالي التوزيعات</label>
            <p className="text-2xl font-bold text-blue-600">₪22,500</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
