interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  onClose?: () => void
}

export default function Alert({ variant = 'info', title, message, onClose }: AlertProps) {
  const variantClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  }

  return (
    <div className={`border-l-4 p-4 ${variantClasses[variant]} rounded`}>
      <div className="flex justify-between items-start">
        <div>
          {title && <h4 className="font-semibold">{title}</h4>}
          <p>{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-lg font-bold hover:opacity-70">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
