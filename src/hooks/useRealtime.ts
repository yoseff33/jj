import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useRealtime<T>(
  table: string,
  onUpdate: (data: T) => void
) {
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    const subscription = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
        },
        (payload) => {
          onUpdate(payload.new as T)
        }
      )
      .subscribe((status) => {
        setIsSubscribed(status === 'SUBSCRIBED')
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [table, onUpdate])

  return isSubscribed
}
