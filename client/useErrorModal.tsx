import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'

export function useErrorModal(
  message: string
): [JSX.Element, (error?: string) => void] {
  const [error, setError] = useState<string | null | undefined>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  return [
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>An error occured</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>{message}</div>
          <Text color="grey">{error}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>,
    (error) => {
      setError(error)
      onOpen()
    },
  ]
}
