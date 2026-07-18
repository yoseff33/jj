interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? '⏳ ...' : children}
    </button>
  )
}
