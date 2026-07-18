import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Alert from '../../components/ui/Alert'
import { supabase } from '../../lib/supabaseClient'

export default function InvestorForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    investment_amount: '',
    status: 'active',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: err } = await supabase.from('investors').insert([formData])
      if (err) throw err
      navigate('/investors')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto rtl">
      <h1 className="text-2xl font-bold mb-6">إضافة مستثمر جديد</h1>

      {error && (
        <Alert variant="error" message={error} onClose={() => setError(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <Input
          label="الاسم"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="البريد الإلكتروني"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Input
          label="الهاتف"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          label="العنوان"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <Input
          label="المبلغ المستثمر"
          name="investment_amount"
          type="number"
          value={formData.investment_amount}
          onChange={handleChange}
        />
        <Select
          label="الحالة"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'active', label: 'نشط' },
            { value: 'inactive', label: 'غير نشط' },
          ]}
        />

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            حفظ
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/investors')}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  )
}
