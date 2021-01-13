export const Token = {
  FORWARD: "FORWARD",
  RIGHT: "RIGHT",
  LEFT: "LEFT",
  LITERAL: "LITERAL",
  REPEAT: "REPEAT",
  RB: "RB",
  LB: "LB",
  ERROR: "ERROR",
  EOF: "EOF",
} as const;

export type TokenType = typeof Token[keyof typeof Token];
