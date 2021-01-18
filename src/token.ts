export const Token = {
  FORWARD: "FORWARD",
  TURN: "TURN",
  LITERAL: "LITERAL",
  REPEAT: "REPEAT",
  OB: "OB",
  CB: "CB",
  ERROR: "ERROR",
  EOF: "EOF"
} as const

export type TokenType = typeof Token[keyof typeof Token]
