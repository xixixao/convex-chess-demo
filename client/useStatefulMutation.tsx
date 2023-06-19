import { useMutation } from 'convex/react'
import {
  DefaultFunctionArgs,
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
  OptionalRestArgs,
} from 'convex/server'
import { useCallback, useState } from 'react'
import { useErrorModal } from '../client/useErrorModal'

export function useStatefulMutation<
  Mutation extends FunctionReference<'mutation', 'public'>,
>(
  mutation: Mutation,
  errorMessage: string,
  config: {
    repeateable: boolean
  } = { repeateable: true },
): [
  { inFlight: boolean; errorModal: React.ReactNode },
  (
    args: Mutation['_args'],
    onResponse?: (response: FunctionReturnType<Mutation>) => void,
  ) => void,
] {
  const [inFlight, setInFlight] = useState(false)
  const [errorModal, showErrorModal] = useErrorModal(errorMessage)

  const mutate = useMutation(mutation)
  const mutateWithErrorHandling = useCallback(
    (
      args: Mutation['_args'],
      onResponse?: (response: FunctionReturnType<Mutation>) => void,
    ) => {
      setInFlight(true)
      mutate(args)
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
