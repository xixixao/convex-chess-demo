import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { useMutation } from '../convex/_generated/react'
import { useErrorModal } from '../client/useErrorModal'

export default function JoinGame(props: {
  setPlayerID: (playerID: string | null) => void
}) {
  const [nickname, nicknameInput] = useNicknameInput()
  const [password, passwordInput] = usePasswordInput()
  const [joinGameErrorModal, showJoinGameErrorModal] = useErrorModal(
    'Could not join the game, please try again'
  )
  const router = useRouter()
  const code = String(router.query.code)
  const joinGame = useMutation('joinGame')
  const handleJoinGame = () => {
    joinGame(code, nickname)
      .then(props.setPlayerID)
      .catch((error) => {
        showJoinGameErrorModal(error.message)
      })
  }

  return (
    <Container my={10} centerContent gap={4}>
      {joinGameErrorModal}
      <Heading as="h1">Welcome to the game!</Heading>
      <div>
        Your game code is: <strong>{code}</strong>
      </div>
      <div>Send it to your friend so that they can join the game.</div>
      <Divider />
      <div>The first player to join will be white.</div>
      What will be your nickname for this game?
      {nicknameInput}
      <Button onClick={handleJoinGame}>Join</Button>
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
