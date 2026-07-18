import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BarChartProps {
  data: any[]
  dataKey: string
  xAxisKey: string
  title?: string
}

export default function BarChart({ data, dataKey, xAxisKey, title }: BarChartProps) {
  return (
    <div className="w-full h-96 bg-white rounded-lg shadow p-4">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill="#3b82f6" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}
