import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import DatePicker from '../../components/ui/DatePicker'
import { supabase } from '../../lib/supabaseClient'

export default function ContractForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    contract_number: '',
    contract_date: '',
    start_date: '',
    end_date: '',
    contract_type: '',
    terms: '',
    status: 'active',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.from('contracts').insert([formData])
      if (error) throw error
      navigate('/contracts')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto rtl">
      <h1 className="text-2xl font-bold mb-6">إضافة عقد جديد</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <Input
          label="رقم العقد"
          name="contract_number"
          value={formData.contract_number}
          onChange={handleChange}
          required
        />
        <DatePicker
          label="تاريخ العقد"
          value={formData.contract_date}
          onChange={(date) => setFormData(prev => ({ ...prev, contract_date: date }))}
        />
        <DatePicker
          label="تاريخ البداية"
          value={formData.start_date}
          onChange={(date) => setFormData(prev => ({ ...prev, start_date: date }))}
        />
        <DatePicker
          label="تاريخ النهاية"
          value={formData.end_date}
          onChange={(date) => setFormData(prev => ({ ...prev, end_date: date }))}
        />
        <Input
          label="نوع العقد"
          name="contract_type"
          value={formData.contract_type}
          onChange={handleChange}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الشروط والأحكام</label>
          <textarea
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={5}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            حفظ
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/contracts')}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  )
}
