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
import { CODE_LENGTH } from '../shared/Code'
import { useStatefulMutation } from './useStatefulMutation'

export default function CreateGame() {
  const [createMutation, createGame] = useStatefulMutation(
    'createGame',
    'Could not create game, please try again',
    { repeateable: false },
  )

  const handleCreateGame = () => {
    createGame([], (result) => {
      window.location.href = `/game/${result.toUpperCase()}`
    })
  }

  const joinGameInput = useJoinGameInput()

  return (
    <Container my={40} centerContent gap={4}>
      {createMutation.errorModal}
      <Heading as="h1">Welcome to online chess!</Heading>
      <Box>No sign up required.</Box>
      {createMutation.inFlight ? (
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

  const [checkMutation, checkGame] = useStatefulMutation(
    'checkGame',
    'This code is not valid',
    { repeateable: false },
  )

  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      checkGame([code], (_success) => {
        window.location.href = `/game/${code.toUpperCase()}`
      })
    }
  }, [code])
  return (
    <Flex alignItems="center" gap={2}>
      {checkMutation.errorModal}
      <Box width="34px" />
      <Input
        width={180}
        placeholder="Enter game code"
        onChange={(event) => {
          setCode(event.target.value)
        }}
      />
      <Box width="34px">
        <Spinner hidden={!checkMutation.inFlight} size="md" />
      </Box>
    </Flex>
  )
}
