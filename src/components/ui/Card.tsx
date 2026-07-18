interface CardProps {
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export default function Card({ title, children, footer }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {title && (
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && <div className="p-4 border-t border-gray-200">{footer}</div>}
    </div>
  )
}
