import { defineSchema, defineTable, s } from 'convex/schema'

export default defineSchema({
  games: defineTable({
    code: s.string(),
    players: s.map(
      s.string(),
      s.object({
        side: s.string(),
        name: s.string(),
      }),
    ),
    currentSide: s.string(),
    moves: s.array(s.array(s.array(s.number()))),
  }),
})
