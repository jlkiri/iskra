import { Scanner } from "./scanner.js";
import type { SparkToken } from "./scanner.js";
import { Token, TokenType } from "./token.js";
import * as Expr from "./expr.js";
import type { Motion } from "./expr.js";

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
    const times = this.literal();
    const movements: Array<Motion> = [];

    this.consume(Token.OB, `Expected a '(' ${JSON.stringify(this.current)}`);

    while (!this.check(Token.CB)) {
      movements.push(this.motion());
    }

    this.consume(Token.CB, `Expected a ')' `);

    return new Expr.Repeat(times, movements);
  }

  // error(msg: string) {}

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

    throw new Error(`Expected motion keyword.`);
  }

  isAtEnd() {
    return this.peek().type == Token.EOF;
  }

  advance() {
    this.previous = this.current;
    this.current = this.scanner.next().value;
    return this.previous;
  }

  peek() {
    return this.current;
  }

  consume(type: TokenType, msg: string) {
    if (this.check(type)) return this.advance();

    throw new Error(msg);
  }

  check(type: TokenType) {
    if (this.isAtEnd()) return false;
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

const scanner = new Scanner("repeat 4 (forward 90)");
const parser = new Parser(scanner);

parser.parse();
