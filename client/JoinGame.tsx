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
import { Page } from './Page'
import { Shimmer } from './Shimmer'
import { useNavigate } from './useNavigate'
import { useStatefulMutation } from './useStatefulMutation'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'

export default function JoinGame() {
  return (
    <Page
      my={10}
      title="Welcome to the game!"
      errorMessage="Wrong game code, start again"
    >
      <JoinAndSetNickname />
    </Page>
  )
}

function JoinAndSetNickname() {
  const router = useRouter()
  const navigate = useNavigate()
  const code = String(router.query.code ?? '')
  const [nickname, nicknameInput] = useNicknameInput()
  const lobbyState = useQuery(api.lobby.state, { code })

  const [joinMutation, joinGame] = useStatefulMutation(
    api.game.join,
    'Could not join the game, please try again',
    { repeateable: false },
  )
  const handleJoinGame = () => {
    joinGame({ code, name: nickname }, (playerID) => {
      navigate(`/game/${code.toUpperCase()}/${playerID}`)
    })
  }

  return (
    <Container my={10} centerContent gap={4}>
      {joinMutation.errorModal}
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
