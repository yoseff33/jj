import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Alert from '../components/ui/Alert'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        await signUp(email, password)
      } else {
        await signIn(email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4 rtl">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Fazaa ERP</h1>
          <p className="text-gray-600 mt-2">نظام إدارة المالية الشامل</p>
        </div>

        {error && (
          <Alert variant="error" message={error} onClose={() => setError(null)} />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="البريد الإلكتروني"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            label="كلمة المرور"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full">
            {isSignUp ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isSignUp ? 'لديك حساب؟ سجل الدخول' : 'ليس لديك حساب؟ أنشئ واحداً'}
          </button>
        </div>
      </div>
    </div>
  )
}
