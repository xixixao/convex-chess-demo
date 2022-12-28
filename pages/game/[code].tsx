import {
  Box,
  Button,
  Container,
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
import { useMutation } from '../../convex/_generated/react'
import { useErrorModal } from '../../client/useErrorModal'
import JoinGame from '../../client/JoinGame'
import Game from '../../client/Game'

export default function App() {
  const [playerID, setPlayerID] = useState<null | string>(null)

  return playerID == null ? (
    <JoinGame setPlayerID={setPlayerID} />
  ) : (
    <Game playerID={playerID} />
  )
}
