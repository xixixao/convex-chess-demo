import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Spinner,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useErrorModal } from '../client/useErrorModal'
import { useMutation } from '../convex/_generated/react'

export default function CreateGame() {
  const [isCreating, setIsCreating] = useState(false)
  const [createGameErrorModal, showCreateGameErrorModal] = useErrorModal(
    'Could not create game, please try again'
  )

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
          <Input width={180} placeholder="Enter game code" />
        </>
      )}
    </Container>
  )
}
