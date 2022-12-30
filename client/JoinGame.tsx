import {
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Input,
  Spinner,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useQuery } from '../convex/_generated/react'
import { Shimmer } from './Shimmer'
import { useStatefulMutation } from './useStatefulMutation'

export default function JoinGame() {
  const router = useRouter()
  const code = String(router.query.code ?? '')
  const [nickname, nicknameInput] = useNicknameInput()
  const lobbyState = useQuery('lobbyState', code)

  const [joinMutation, joinGame] = useStatefulMutation(
    'joinGame',
    'Could not join the game, please try again',
    { repeateable: false },
  )
  const handleJoinGame = () => {
    joinGame([code, nickname], (playerID) => {
      window.location.href = `/game/${code.toUpperCase()}/${playerID}`
    })
  }

  return (
    <Container my={10} centerContent gap={4}>
      {joinMutation.errorModal}
      <Heading as="h1">Welcome to the game!</Heading>
      <HStack width={'100%'} justifyContent="center">
        <div>Your game code is: </div>
        <Shimmer width="50px" isLoaded={code !== ''}>
          <strong>{code}</strong>
        </Shimmer>
      </HStack>
      <div>Send it to your friend so that they can join the game.</div>
      <Divider />
      {joinMutation.inFlight ? (
        <Spinner />
      ) : (
        <>
          {lobbyState == null ? (
            <Shimmer width="50%" />
          ) : (
            <div>
              {(lobbyState.numPlayersJoined ?? 0) >= 2 ? (
                <>The game is full</>
              ) : (lobbyState.numPlayersJoined ?? 0) >= 1 ? (
                <>You will be black</>
              ) : (
                <>The first player to join will be white.</>
              )}
            </div>
          )}
          What will be your nickname for this game?
          {nicknameInput}
          <Button onClick={handleJoinGame}>Join</Button>
        </>
      )}
    </Container>
  )
}

function useNicknameInput(): [string, JSX.Element] {
  const [nickname, setNickname] = useState('')
  const nicknameInput = (
    <Input
      maxLength={12}
      width={180}
      placeholder="your nickname"
      value={nickname}
      onChange={(e) => setNickname(e.target.value)}
    />
  )
  return [nickname, nicknameInput]
}
