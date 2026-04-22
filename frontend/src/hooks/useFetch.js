import { useState, useEffect } from 'react'
import api from '../utils/api'

/**
 * useFetch — generic data-fetching hook.
 * @param {string} endpoint - API endpoint (e.g. '/community-needs')
 * @param {any}    fallback  - data to use when API is unavailable (mock)
 */
export default function useFetch(endpoint, fallback = null) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get(endpoint)
        if (!cancelled) setData(res.data)
      } catch (err) {
        if (!cancelled) {
          // In demo/dev mode fall back to mock data
          if (fallback !== null) {
            setData(fallback)
          } else {
            setError(err.message)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [endpoint])

  return { data, loading, error, setData }
}
