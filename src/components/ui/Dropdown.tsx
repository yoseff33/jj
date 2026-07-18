import { useState, useRef } from 'react'

interface DropdownProps {
  label?: string
  options: { label: string; onClick: () => void }[]
  children?: React.ReactNode
}

export default function Dropdown({ label, options, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200"
      >
        {label || 'القائمة'} ▼
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                option.onClick()
                setIsOpen(false)
              }}
              className="w-full text-right px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
