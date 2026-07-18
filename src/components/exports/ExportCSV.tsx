interface ExportCSVProps {
  filename: string
  headers: string[]
  data: any[][]
}

export default function ExportCSV({ filename, headers, data }: ExportCSVProps) {
  const handleExport = () => {
    const csv = [
      headers.join(','),
      ...data.map(row => row.join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      تنزيل CSV
    </button>
  )
}
