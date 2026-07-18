import { useState } from 'react'

interface Tab {
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: number
}

export default function Tabs({ tabs, defaultTab = 0 }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div>
      <div className="border-b border-gray-300 flex gap-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 font-semibold border-b-2 transition ${
              activeTab === index
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs[activeTab].content}</div>
    </div>
  )
}
