interface TableProps {
  headers: string[]
  rows: (string | number | React.ReactNode)[]
  actions?: React.ReactNode
}

export default function Table({ headers, rows, actions }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="border border-gray-300 p-3 text-right font-semibold">
                {header}
              </th>
            ))}
            {actions && <th className="border border-gray-300 p-3 text-right font-semibold">الإجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {Array.isArray(row) ? (
                <>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-gray-300 p-3">
                      {cell}
                    </td>
                  ))}
                </>
              ) : (
                <td className="border border-gray-300 p-3">{row}</td>
              )}
              {actions && <td className="border border-gray-300 p-3">{actions}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
