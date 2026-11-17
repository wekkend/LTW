import { useEffect, useState } from 'react'
import { getErrorMessage } from '../api/axiosClient.js'

// Hook gọi API khi trang mở (hoặc khi `deps` đổi) và theo dõi 3 trạng thái: loading / error / data.
//   const { data, loading, error } = useApi(() => laptopApi.getAll(), [])
export default function useApi(fetcher, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: '' })

  useEffect(() => {
    let cancelled = false // tránh setState khi component đã bị đóng
    setState((s) => ({ ...s, loading: true, error: '' }))
    fetcher()
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: '' }) })
      .catch((e) => { if (!cancelled) setState({ data: null, loading: false, error: getErrorMessage(e) }) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
