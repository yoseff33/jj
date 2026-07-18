interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  children: React.ReactNode
}

export default function Badge({ variant = 'primary', children }: BadgeProps) {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-indigo-100 text-indigo-800',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${variantClasses[variant]}`}>
      {children}
    </span>
  )
}
