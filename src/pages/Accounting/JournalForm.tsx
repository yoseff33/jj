import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import DatePicker from '../../components/ui/DatePicker'
import { supabase } from '../../lib/supabaseClient'

export default function JournalForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    entry_number: '',
    entry_date: '',
    description: '',
    reference: '',
    status: 'draft',
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
      const { error } = await supabase.from('journal_entries').insert([formData])
      if (error) throw error
      navigate('/accounting/journal-entries')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto rtl">
      <h1 className="text-2xl font-bold mb-6">قيد جديد</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <Input
          label="رقم القيد"
          name="entry_number"
          value={formData.entry_number}
          onChange={handleChange}
          required
        />
        <DatePicker
          label="تاريخ القيد"
          value={formData.entry_date}
          onChange={(date) => setFormData(prev => ({ ...prev, entry_date: date }))}
        />
        <Input
          label="الوصف"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <Input
          label="المرجع"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="draft">مسودة</option>
          <option value="posted">مرسل</option>
        </select>

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            حفظ
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/accounting/journal-entries')}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  )
}
