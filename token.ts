export const Token = {
  KEYWORD: "KEYWORD",
  INTEGER: "INTEGER",
  RB: "RB",
  LB: "LB",
} as const;

export type TokenType = typeof Token[keyof typeof Token];
