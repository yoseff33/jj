import { useState } from 'react'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  label?: string
}

export default function DatePicker({ value, onChange, label }: DatePickerProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}
