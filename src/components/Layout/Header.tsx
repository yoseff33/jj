import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { user } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 rtl">
      <div className="flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 rounded hover:bg-gray-100"
        >
          ☰
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">Fazaa ERP</h2>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-2 rounded hover:bg-gray-100"
          >
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{user?.email}</p>
              <p className="text-xs text-gray-500">المسؤول</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button className="w-full text-right px-4 py-2 hover:bg-gray-100 border-b">
                الملف الشخصي
              </button>
              <button className="w-full text-right px-4 py-2 hover:bg-gray-100">
                تغيير كلمة المرور
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
