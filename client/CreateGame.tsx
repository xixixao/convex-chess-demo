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
import { FormEvent, useEffect, useState } from 'react'
import { useMutation, useQuery } from '../convex/_generated/react'
import { useErrorModal } from '../client/useErrorModal'

export default function CreateGame() {
  const [createGameErrorModal, showCreateGameErrorModal] = useErrorModal(
    'Could not create game, please try again'
  )

  const createGame = useMutation('createGame')
  const handleCreateGame = () => {
    createGame()
      .then((result) => {
        window.location.href = `/game/${result.toUpperCase()}`
      })
      .catch((error) => {
        showCreateGameErrorModal()
      })
  }

  return (
    <Container my={40} centerContent gap={4}>
      {createGameErrorModal}
      <Heading as="h1">Welcome to online chess!</Heading>
      <Box>No sign up required.</Box>
      <Button onClick={handleCreateGame}>Create a game</Button>
      or
      <div>Join a game:</div>
      <Input width={180} placeholder="Enter game code" />
    </Container>
  )
}
