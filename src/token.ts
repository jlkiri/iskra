export const Token = {
  FORWARD: "FORWARD",
  RIGHT: "RIGHT",
  LEFT: "LEFT",
  LITERAL: "LITERAL",
  REPEAT: "REPEAT",
  OB: "OB",
  CB: "CB",
  ERROR: "ERROR",
  EOF: "EOF",
} as const;

export type TokenType = typeof Token[keyof typeof Token];
