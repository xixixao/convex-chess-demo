export type GameState = {
  currentSide: Side
  board: [Piece]
  outcome: 'playing' | 'win' | 'draw'
}

export type Piece = {
  name: 'r' | 'n' | 'b' | 'q' | 'k' | 'p'
  side: Side
  position: Position
}

export type Position = [number, number]

export type Side = 'white' | 'black'
