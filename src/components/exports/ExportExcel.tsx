import * as XLSX from 'xlsx'

interface ExportExcelProps {
  filename: string
  sheetName: string
  headers: string[]
  data: any[][]
}

export default function ExportExcel({ filename, sheetName, headers, data }: ExportExcelProps) {
  const handleExport = () => {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  }

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      تنزيل Excel
    </button>
  )
}
