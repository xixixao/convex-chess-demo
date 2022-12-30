import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Spinner,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useErrorModal } from '../client/useErrorModal'
import { useMutation } from '../convex/_generated/react'
import { CODE_LENGTH } from '../shared/Code'

export default function CreateGame() {
  const [isCreating, setIsCreating] = useState(false)
  const [createGameErrorModal, showCreateGameErrorModal] = useErrorModal(
    'Could not create game, please try again'
  )
  const joinGameInput = useJoinGameInput()

  const createGame = useMutation('createGame')
  const handleCreateGame = () => {
    setIsCreating(true)
    createGame()
      .then((result) => {
        window.location.href = `/game/${result.toUpperCase()}`
      })
      .catch((error) => {
        showCreateGameErrorModal(error.message)
      })
  }

  return (
    <Container my={40} centerContent gap={4}>
      {createGameErrorModal}
      <Heading as="h1">Welcome to online chess!</Heading>
      <Box>No sign up required.</Box>
      {isCreating ? (
        <Spinner />
      ) : (
        <>
          <Button onClick={handleCreateGame}>Create a game</Button>
          or
          <div>Join a game:</div>
          {joinGameInput}
        </>
      )}
    </Container>
  )
}

function useJoinGameInput() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const checkGame = useMutation('checkGame')
  const [errorModal, showErrorModal] = useErrorModal('This code is not valid')
  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      setIsLoading(true)
      checkGame(code)
        .then((_success) => {
          window.location.href = `/game/${code.toUpperCase()}`
        })
        .catch((error) => {
          setIsLoading(false)
          showErrorModal(error.message)
        })
    }
  }, [code])
  return (
    <Flex alignItems="center" gap={2}>
      {errorModal}
      <Box width="34px" />
      <Input
        width={180}
        placeholder="Enter game code"
        onChange={(event) => {
          setCode(event.target.value)
        }}
      />
      <Box width="34px">
        <Spinner hidden={!isLoading} size="md" />
      </Box>
    </Flex>
  )
}
