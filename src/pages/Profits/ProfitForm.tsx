import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import DatePicker from '../../components/ui/DatePicker'
import { supabase } from '../../lib/supabaseClient'

export default function ProfitForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    distribution_date: '',
    period_start: '',
    period_end: '',
    total_profit: '',
    status: 'draft',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.from('profit_distributions').insert([{
        ...formData,
        total_profit: parseFloat(formData.total_profit)
      }])
      if (error) throw error
      navigate('/profits')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto rtl">
      <h1 className="text-2xl font-bold mb-6">توزيع أرباح جديد</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <DatePicker
          label="تاريخ التوزيع"
          value={formData.distribution_date}
          onChange={(date) => setFormData(prev => ({ ...prev, distribution_date: date }))}
        />
        <DatePicker
          label="بداية الفترة"
          value={formData.period_start}
          onChange={(date) => setFormData(prev => ({ ...prev, period_start: date }))}
        />
        <DatePicker
          label="نهاية الفترة"
          value={formData.period_end}
          onChange={(date) => setFormData(prev => ({ ...prev, period_end: date }))}
        />
        <Input
          label="إجمالي الأرباح"
          name="total_profit"
          type="number"
          value={formData.total_profit}
          onChange={handleChange}
          required
        />

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            حفظ
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/profits')}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  )
}
