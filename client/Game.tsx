import {
  Box,
  Button,
  Container,
  Flex,
  SimpleGrid,
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
  Spinner,
  background,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useRef, useState } from 'react'
// @ts-ignore
import Piece from 'react-chess-pieces'
import { useMutation, useQuery } from '../convex/_generated/react'
import type { GameState, Position } from '../shared/GameState'
import Draggable, {
  DraggableData,
  DraggableEvent,
  DraggableEventHandler,
} from 'react-draggable'

export default function Game(props: { playerID: string }) {
  return (
    <Container my={10} centerContent gap={4}>
      <Heading as="h1">The game is afoot!</Heading>
      <Board playerID={props.playerID} />
    </Container>
  )
}

function Board(props: { playerID: string }) {
  const router = useRouter()
  const code = String(router.query.code)
  const gameState = useQuery('gameState', code, props.playerID)
  const movePiece = useMutation('movePiece')

  if (gameState == null) {
    return null
  }

  const pieceLookup = getPositionLookup(getBoard(gameState.moves))
  const handleMovePiece = (piece: Piece, x: number, y: number) => {
    movePiece(code, props.playerID, [piece.position, [x, y]])
  }
  return (
    <>
      <div>
        {gameState.otherPlayer == null ? (
          <>
            Waiting for your opponent, the game code is: <strong>{code}</strong>
          </>
        ) : (
          gameState.otherPlayer.name + ' is ' + gameState.otherPlayer.side
        )}
      </div>
      <SimpleGrid columns={8} spacing={1}>
        {[...Array(8)].map((_, rowIndex) =>
          [...Array(8)].map((_, colIndex) => {
            const piece = pieceLookup(colIndex, rowIndex)
            return (
              <Box bg={colIndex % 2 === rowIndex % 2 ? 'tomato' : '#ccc'}>
                <Box
                  data-name="cell"
                  data-x={colIndex}
                  data-y={rowIndex}
                  _selected={{ background: 'rgba(0, 0, 0, 0.2)' }}
                  width="50px"
                  height="50px"
                >
                  {piece != null ? (
                    <DraggablePiece
                      viewerSide={gameState.viewer.side}
                      movePiece={handleMovePiece}
                      piece={piece}
                    />
                  ) : null}
                </Box>
              </Box>
            )
          })
        )}
      </SimpleGrid>
      <div>
        You, {gameState.viewer.name}, are {gameState.viewer.side}
      </div>
      {gameState.currentSide === gameState.viewer.side
        ? "It's your turn!"
        : "It's your opponent's turn!"}
    </>
  )
}

function DraggablePiece(props: {
  piece: Piece
  movePiece: (piece: Piece, x: number, y: number) => void
  viewerSide: 'white' | 'black'
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const nodeRef = useRef(null)
  const startPositionRef = useRef<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const cellRef = useRef<Element | null>(null)
  const resetCell = () => {
    cellRef.current?.removeAttribute('data-selected')
  }
  const findCell = (data: DraggableData) => {
    const node = data.node
    const { top, left } = node.getBoundingClientRect()
    const otherElement = document
      .elementsFromPoint(
        left + node.clientWidth / 2,
        top + node.clientHeight / 2
      )
      .find((element) => !node.contains(element))
    return findParentElement(
      otherElement,
      (node) => node.getAttribute('data-name') === 'cell'
    )
  }
  const handleDrag = (_event: DraggableEvent, data: DraggableData) => {
    resetCell()
    const cell = findCell(data)
    if (cell != null) {
      cellRef.current = cell
      cell.setAttribute('data-selected', 'true')
    }
  }
  if (props.piece.side !== props.viewerSide) {
    return <Piece piece={props.piece.name} />
  }
  return (
    <Draggable
      position={position}
      onStart={(_event, data) => {
        const { x, y } = data.node.getBoundingClientRect()
        startPositionRef.current = { x, y }
        setIsDragging(true)
      }}
      onDrag={handleDrag}
      onStop={(_event, data) => {
        resetCell()
        const cell = findCell(data)
        if (cell != null) {
          const x = Number(cell.getAttribute('data-x'))
          const y = Number(cell.getAttribute('data-y'))
          if (x !== props.piece.position[0] || y !== props.piece.position[1]) {
            props.movePiece(props.piece, x, y)
            // get relative position of data.node to cell
            const startPosition = startPositionRef.current!
            const cellRect = cell.getBoundingClientRect()
            setPosition({
              x: cellRect.x - startPosition.x + position.x,
              y: cellRect.y - startPosition.y + position.y,
            })
          }
        }
        setIsDragging(false)
      }}
      nodeRef={nodeRef}
    >
      <Box
        position="relative"
        zIndex={isDragging ? 100 : undefined}
        cursor={isDragging ? 'grabbing' : 'grab'}
        _hover={{ background: isDragging ? undefined : 'rgba(0, 0, 0, 0.2)' }}
        ref={nodeRef}
      >
        <Piece piece={props.piece.name} />
      </Box>
    </Draggable>
  )
}

function getBoard(moves: Array<[Position, Position]>) {
  const board = defaultBoard('white').concat(defaultBoard('black'))
  moves.forEach(([from, to]) => {
    // remove piece at to
    const index = board.findIndex(
      (piece) => piece.position[0] === to[0] && piece.position[1] === to[1]
    )
    if (index !== -1) {
      board.splice(index, 1)
    }

    const piece = board.find(
      (piece) => piece.position[0] === from[0] && piece.position[1] === from[1]
    )
    if (piece != null) {
      piece.position = to
    }
  })
  return board
}

function defaultBoard(side: 'white' | 'black') {
  return initialPosition.flatMap((row, y) =>
    row.map((name, x) => {
      return {
        name: side === 'black' ? name : name.toUpperCase(),
        side,
        position: [x, side === 'white' ? 7 - y : y],
      }
    })
  )
}

const initialPosition = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
]

function getPositionLookup(board: Piece[]) {
  const piecePositionLookup = new Map()
  board.forEach((piece) => {
    const [x, y] = piece.position
    piecePositionLookup.set(`${x},${y}`, piece)
  })
  return (x: number, y: number) =>
    piecePositionLookup.get(`${x},${y}`) as Piece | null
}

function findParentElement(
  node: Element | null | undefined,
  filter: (node: Element) => boolean
): Element | null {
  if (node == null) {
    return null
  }
  if (filter(node)) {
    return node
  }
  return findParentElement(node.parentElement, filter)
}

function oppositeSide(side: 'white' | 'black') {
  return side === 'white' ? 'black' : 'white'
}
