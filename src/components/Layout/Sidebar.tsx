import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const menuItems = [
  { label: 'لوحة التحكم', href: '/', icon: '📊' },
  { label: 'المستثمرين', href: '/investors', icon: '👥' },
  { label: 'العقود', href: '/contracts', icon: '📄' },
  {
    label: 'المحاسبة',
    icon: '📚',
    submenu: [
      { label: 'دليل الحسابات', href: '/accounting/chart' },
      { label: 'قيود اليوميات', href: '/accounting/journal-entries' },
      { label: 'ميزان المراجعة', href: '/accounting/trial-balance' },
      { label: 'قائمة الدخل', href: '/accounting/income-statement' },
      { label: 'الميزانية العمومية', href: '/accounting/balance-sheet' },
      { label: 'الأستاذ العام', href: '/accounting/general-ledger' },
    ],
  },
  {
    label: 'الخزينة',
    icon: '💰',
    submenu: [
      { label: 'الإيصالات', href: '/treasury/receipts' },
      { label: 'المدفوعات', href: '/treasury/payments' },
    ],
  },
  { label: 'توزيع الأرباح', href: '/profits', icon: '💵' },
  { label: 'التقارير', href: '/reports', icon: '📈' },
  { label: 'سجل التدقيق', href: '/audit', icon: '🔍' },
  { label: 'المستخدمين', href: '/users', icon: '👨‍💼' },
  { label: 'الإعدادات', href: '/settings', icon: '⚙️' },
]

export default function Sidebar() {
  const location = useLocation()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <div className="flex flex-col h-full w-64 bg-white border-l border-gray-200">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">Fazaa ERP</h1>
        <p className="text-sm text-gray-500">نظام الإدارة المالية</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer p-2 rounded hover:bg-gray-100">
                    <span className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <ul className="pr-6 space-y-1 mt-2">
                    {item.submenu.map((subitem, subindex) => (
                      <li key={subindex}>
                        <Link
                          to={subitem.href}
                          className={`block p-2 rounded text-sm ${
                            location.pathname === subitem.href
                              ? 'bg-blue-100 text-blue-600 font-semibold'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {subitem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link
                  to={item.href}
                  className={`flex items-center gap-2 p-2 rounded ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}
