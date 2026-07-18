import Card from '../../components/ui/Card'
import BarChart from '../../components/charts/BarChart'

export default function Reports() {
  const mockData = [
    { month: 'يناير', revenue: 50000, expense: 30000, profit: 20000 },
    { month: 'فبراير', revenue: 60000, expense: 35000, profit: 25000 },
    { month: 'مارس', revenue: 55000, expense: 40000, profit: 15000 },
    { month: 'أبريل', revenue: 70000, expense: 45000, profit: 25000 },
    { month: 'مايو', revenue: 80000, expense: 50000, profit: 30000 },
    { month: 'يونيو', revenue: 90000, expense: 55000, profit: 35000 },
  ]

  return (
    <div className="space-y-6 rtl">
      <h1 className="text-2xl font-bold">التقارير</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">إجمالي الإيرادات</p>
            <p className="text-3xl font-bold text-green-600">﷼450,000</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">إجمالي المصروفات</p>
            <p className="text-3xl font-bold text-red-600">﷼255,000</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-2">الربح الصافي</p>
            <p className="text-3xl font-bold text-blue-600">﷼195,000</p>
          </div>
        </Card>
      </div>

      <Card title="أداء الإيرادات والمصروفات الشهرية">
        <BarChart
          data={mockData}
          xAxisKey="month"
          dataKey="profit"
          title="الأرباح الشهرية"
        />
      </Card>
    </div>
  )
}
