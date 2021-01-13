import { Scanner } from "./scanner.js";
import type { SparkToken } from "./scanner.js";
import { Token, TokenType } from "./token.js";
import * as Expr from "./expr.js";

/* const Motion = {
  FORWARD: "FORWARD",
  RIGHT: "RIGHT",
  LEFT: "LEFT",
} as const; */

export class Parser {
  private scanner: Scanner;
  private current: SparkToken;
  private previous: SparkToken | null;

  constructor(scanner: Scanner) {
    this.scanner = scanner;
    this.current = this.scanner.next().value;
    this.previous = null;
  }

  repeat() {
    // TODO
  }

  error(msg: string) {}

  literal() {
    if (this.check(Token.LITERAL)) {
      return new Expr.Literal(this.advance());
    }

    throw new Error(`Expected literal: ${JSON.stringify(this.current)}`);
  }

  motion() {
    if (this.match(Token.FORWARD)) {
      return new Expr.Forward(this.literal());
    }
  }

  isAtEnd() {
    return this.check(Token.EOF);
  }

  advance() {
    this.previous = this.current;
    this.current = this.scanner.next().value;
    return this.previous;
  }

  peek() {
    return this.current;
  }

  check(type: TokenType) {
    return this.peek().type == Token[type];
  }

  match(type: TokenType) {
    if (this.check(type)) {
      this.advance();
      return true;
    }

    return false;
  }

  command() {
    if (this.match(Token.REPEAT)) {
      return this.repeat();
    }

    return this.motion();
  }

  parse() {
    console.log(this.command());
  }
}

const scanner = new Scanner("forward 90");
const parser = new Parser(scanner);

parser.parse();
