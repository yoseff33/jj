import { useAuth } from '../../hooks/useAuth'

export default function MobileNav() {
  const { user } = useAuth()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around p-2">
        <a href="/" className="flex flex-col items-center gap-1 p-2 text-xs">
          📊
          <span>الرئيسية</span>
        </a>
        <a href="/investors" className="flex flex-col items-center gap-1 p-2 text-xs">
          👥
          <span>المستثمرين</span>
        </a>
        <a href="/accounting/journal-entries" className="flex flex-col items-center gap-1 p-2 text-xs">
          📚
          <span>المحاسبة</span>
        </a>
        <a href="/treasury/receipts" className="flex flex-col items-center gap-1 p-2 text-xs">
          💰
          <span>الخزينة</span>
        </a>
      </div>
    </nav>
  )
}
