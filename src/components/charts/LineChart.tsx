import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface LineChartProps {
  data: any[]
  dataKey: string
  xAxisKey: string
  title?: string
}

export default function LineChart({ data, dataKey, xAxisKey, title }: LineChartProps) {
  return (
    <div className="w-full h-96 bg-white rounded-lg shadow p-4">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke="#3b82f6" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}
