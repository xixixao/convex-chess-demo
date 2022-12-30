import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  SkeletonText,
  Spinner,
  useChakra,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useErrorModal } from '../client/useErrorModal'
import { useMutation, useQuery } from '../convex/_generated/react'
import { Shimmer } from './Shimmer'

export default function JoinGame() {
  const router = useRouter()
  const code = String(router.query.code ?? '')
  const [nickname, nicknameInput] = useNicknameInput()
  const [isJoining, setIsJoining] = useState(false)
  const lobbyState = useQuery('lobbyState', code)
  const [joinGameErrorModal, showJoinGameErrorModal] = useErrorModal(
    'Could not join the game, please try again'
  )
  const joinGame = useMutation('joinGame')
  const handleJoinGame = () => {
    setIsJoining(true)
    joinGame(code, nickname)
      .then((playerID) => {
        window.location.href = `/game/${code.toUpperCase()}/${playerID}`
      })
      .catch((error) => {
        showJoinGameErrorModal(error.message)
      })
  }

  return (
    <Container my={10} centerContent gap={4}>
      {joinGameErrorModal}
      <Heading as="h1">Welcome to the game!</Heading>
      <HStack width={'100%'} justifyContent="center">
        <div>Your game code is: </div>
        <Shimmer width="50px" isLoaded={code !== ''}>
          <strong>{code}</strong>
        </Shimmer>
      </HStack>
      <div>Send it to your friend so that they can join the game.</div>
      <Divider />
      {isJoining ? (
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

function usePasswordInput(): [string, JSX.Element] {
  const [password, setPassword] = useState('')
  const nicknameInput = (
    <Input
      type="password"
      maxLength={12}
      width={180}
      placeholder="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
  )
  return [password, nicknameInput]
}
