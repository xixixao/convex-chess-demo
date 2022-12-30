import { MutationNames } from 'convex/dist/types/api/api'
import { NamedMutation } from 'convex/dist/types/browser/browser'
import { useCallback, useState } from 'react'
import { useErrorModal } from '../client/useErrorModal'
import { API } from '../convex/_generated/api'
import { useMutation } from '../convex/_generated/react'

export function useStatefulMutation<Name extends MutationNames<API>>(
  name: Name,
  errorMessage: string,
  config: {
    repeateable: boolean
  } = { repeateable: true },
): [
  { inFlight: boolean; errorModal: React.ReactNode },
  (
    args: Parameters<NamedMutation<API, Name>>,
    onResponse?: (response: ReturnType<NamedMutation<API, Name>>) => void,
  ) => void,
] {
  const [inFlight, setInFlight] = useState(false)
  const [errorModal, showErrorModal] = useErrorModal(errorMessage)

  const mutate = useMutation(name)
  const mutateWithErrorHandling = useCallback(
    (
      args: Parameters<NamedMutation<API, Name>>,
      onResponse?: (response: ReturnType<NamedMutation<API, Name>>) => void,
    ) => {
      setInFlight(true)
      mutate(...args)
        .then((response) => {
          onResponse?.(response)
          if (config.repeateable) {
            setInFlight(false)
          }
        })
        .catch((error) => {
          showErrorModal(error.message)
          setInFlight(false)
        })
    },
    [mutate, setInFlight, showErrorModal],
  )
  return [{ inFlight, errorModal }, mutateWithErrorHandling]
}
