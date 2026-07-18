import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import DatePicker from '../../components/ui/DatePicker'
import Select from '../../components/ui/Select'
import { supabase } from '../../lib/supabaseClient'

export default function PaymentForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    payment_number: '',
    payment_date: '',
    payee_name: '',
    amount: '',
    payment_method: 'cash',
    reference: '',
    notes: '',
    status: 'pending',
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
      const { error } = await supabase.from('payments').insert([{ ...formData, amount: parseFloat(formData.amount) }])
      if (error) throw error
      navigate('/treasury/payments')
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto rtl">
      <h1 className="text-2xl font-bold mb-6">دفعة جديدة</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <Input
          label="رقم الدفعة"
          name="payment_number"
          value={formData.payment_number}
          onChange={handleChange}
          required
        />
        <DatePicker
          label="التاريخ"
          value={formData.payment_date}
          onChange={(date) => setFormData(prev => ({ ...prev, payment_date: date }))}
        />
        <Input
          label="المستفيد"
          name="payee_name"
          value={formData.payee_name}
          onChange={handleChange}
          required
        />
        <Input
          label="المبلغ"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <Select
          label="طريقة الدفع"
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
          options={[
            { value: 'cash', label: 'نقد' },
            { value: 'check', label: 'شيك' },
            { value: 'bank_transfer', label: 'تحويل بنكي' },
          ]}
        />
        <Input
          label="المرجع"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الملاحظات</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            حفظ
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/treasury/payments')}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  )
}
