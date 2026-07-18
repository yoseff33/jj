import { useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '../lib/supabaseClient'

export function useSupabaseQuery<T>(
  table: string,
  query?: Record<string, any>
) {
  const { user } = useAuth()
  const [data, setData] = useState<T[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        let q = supabase.from(table).select('*')

        if (query) {
          Object.entries(query).forEach(([key, value]) => {
            q = q.eq(key, value)
          })
        }

        const { data: result, error: err } = await q

        if (err) throw err
        setData(result as T[])
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, table, query])

  return { data, loading, error }
}
