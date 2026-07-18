import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'

export default function Settings() {
  return (
    <div className="space-y-6 rtl">
      <h1 className="text-2xl font-bold">الإعدادات</h1>

      <Card title="إعدادات النظام">
        <div className="space-y-4">
          <Input label="اسم الشركة" defaultValue="Fazaa ERP" />
          <Input label="البريد الإلكتروني للدعم" defaultValue="support@fazaa.com" />
          <Input label="رقم الهاتف" defaultValue="+966501234567" />
          <Select
            label="العملة"
            options={[
              { value: 'SAR', label: 'الريال السعودي (﷼)' },
              { value: 'USD', label: 'الدولار الأمريكي ($)' },
              { value: 'EUR', label: 'اليورو (€)' },
            ]}
          />
          <Select
            label="اللغة"
            options={[
              { value: 'ar', label: 'العربية' },
              { value: 'en', label: 'الإنجليزية' },
            ]}
          />
        </div>
      </Card>

      <Card title="إعدادات الأمان">
        <div className="space-y-4">
          <Button variant="primary">تغيير كلمة المرور</Button>
          <Button variant="secondary">تمكين المصادقة الثنائية</Button>
          <Button variant="danger">تسجيل الخروج من جميع الأجهزة</Button>
        </div>
      </Card>

      <Card title="إعدادات النسخ الاحتياطي">
        <div className="space-y-4">
          <p className="text-gray-600">آخر نسخة احتياطية: 18 يوليو 2026</p>
          <Button variant="primary">إنشاء نسخة احتياطية الآن</Button>
          <Button variant="secondary">استعادة من نسخة احتياطية</Button>
        </div>
      </Card>

      <div className="flex gap-4 pt-4">
        <Button variant="primary">حفظ الإعدادات</Button>
        <Button variant="secondary">إلغاء</Button>
      </div>
    </div>
  )
}
