import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface ExportPDFProps {
  filename: string
  title: string
  headers: string[]
  data: any[][]
}

export default function ExportPDF({ filename, title, headers, data }: ExportPDFProps) {
  const handleExport = () => {
    const doc = new jsPDF()
    doc.text(title, 14, 15)
    
    // @ts-ignore
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 25,
      didDrawPage: (data) => {
        const pageSize = doc.internal.pageSize
        const pageHeight = pageSize.getHeight()
        const pageWidth = pageSize.getWidth()
        doc.setFontSize(10)
        doc.text(
          `${doc.internal.getNumberOfPages()}`,
          pageWidth - 10,
          pageHeight - 10
        )
      },
    })

    doc.save(`${filename}.pdf`)
  }

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      تنزيل PDF
    </button>
  )
}
