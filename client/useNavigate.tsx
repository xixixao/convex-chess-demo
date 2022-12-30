import { useRouter } from 'next/router'
import { useCallback } from 'react'

export function useNavigate() {
  const router = useRouter()
  return useCallback(
    (href: string) => {
      router.push(href)
    },
    [router],
  )
}
