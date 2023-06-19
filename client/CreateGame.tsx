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
import { Page } from './Page'
import { useNavigate } from './useNavigate'
import { useStatefulMutation } from './useStatefulMutation'
import { api } from '../convex/_generated/api'

export default function CreateGame() {
  const navigate = useNavigate()
  const [createMutation, createGame] = useStatefulMutation(
    api.game.create,
    'Could not create game, please try again',
    { repeateable: false },
  )

  const handleCreateGame = () => {
    createGame({}, (result) => {
      navigate(`/game/${result.toUpperCase()}`)
    })
  }

  const joinGameInput = useJoinGameInput()

  return (
    <Page
      my={40}
      title="Welcome to online chess!"
      errorMessage="Unexpected error, come back later"
    >
      {createMutation.errorModal}
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
    </Page>
  )
}

function useJoinGameInput() {
  const [code, setCode] = useState('')

  const [checkMutation, checkGame] = useStatefulMutation(
    api.game.check,
    'This code is not valid',
    { repeateable: false },
  )

  const navigate = useNavigate()

  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      checkGame({ code }, (_success) => {
        navigate(`/game/${code.toUpperCase()}`)
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
