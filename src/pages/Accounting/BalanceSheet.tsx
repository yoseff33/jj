import { useSupabaseQuery } from '../../hooks/useSupabaseQuery'
import Loading from '../../components/ui/Loading'

export default function BalanceSheet() {
  const { data: sheet, loading } = useSupabaseQuery('balance_sheet')

  if (loading) return <Loading />

  const assets = sheet?.filter((s: any) => s.account_type === 'Asset') || []
  const liabilities = sheet?.filter((s: any) => s.account_type === 'Liability') || []
  const equity = sheet?.filter((s: any) => s.account_type === 'Equity') || []

  const totalAssets = assets.reduce((sum: number, a: any) => sum + (a.balance || 0), 0)
  const totalLiabilities = liabilities.reduce((sum: number, l: any) => sum + (l.balance || 0), 0)
  const totalEquity = equity.reduce((sum: number, e: any) => sum + (e.balance || 0), 0)

  return (
    <div className="space-y-6 rtl">
      <h1 className="text-2xl font-bold">الميزانية العمومية</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4 text-blue-600">الأصول</h2>
          <table className="w-full">
            <tbody>
              {assets.map((asset: any) => (
                <tr key={asset.id} className="border-b">
                  <td className="py-2">{asset.account_name}</td>
                  <td className="py-2 text-left">﷼{asset.balance?.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="font-bold bg-blue-50">
                <td className="py-2">إجمالي الأصول</td>
                <td className="py-2 text-left">﷼{totalAssets.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Liabilities & Equity */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-red-600">الالتزامات</h2>
            <table className="w-full">
              <tbody>
                {liabilities.map((liability: any) => (
                  <tr key={liability.id} className="border-b">
                    <td className="py-2">{liability.account_name}</td>
                    <td className="py-2 text-left">﷼{liability.balance?.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-red-50">
                  <td className="py-2">إجمالي الالتزامات</td>
                  <td className="py-2 text-left">﷼{totalLiabilities.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-green-600">حقوق الملكية</h2>
            <table className="w-full">
              <tbody>
                {equity.map((eq: any) => (
                  <tr key={eq.id} className="border-b">
                    <td className="py-2">{eq.account_name}</td>
                    <td className="py-2 text-left">﷼{eq.balance?.toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-green-50">
                  <td className="py-2">إجمالي حقوق الملكية</td>
                  <td className="py-2 text-left">﷼{totalEquity.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
