import { Scanner } from "./scanner.js"
import type { SparkToken } from "./scanner.js"
import { Token, TokenType } from "./token.js"
import * as Expr from "./expr.js"
import type { Motion } from "./expr.js"

class ParseError extends Error {}

export class Parser {
  private scanner: Scanner
  private current: SparkToken
  private previous: SparkToken | null

  constructor(scanner: Scanner) {
    this.scanner = scanner
    this.current = this.scanner.next().value
    this.previous = null
  }

  repeat() {
    const times = this.literal()
    const movements: Array<Motion | Expr.Repeat> = []

    this.consume(Token.OB, `Expected a '(', got '${this.stringify_current()}'.`)

    while (!this.check(Token.CB)) {
      movements.push(this.command())
    }

    this.consume(Token.CB, `Expected a ')', got '${this.stringify_current()}'.`)

    return new Expr.Repeat(times, movements)
  }

  stringify_current() {
    if (this.check(Token.ERROR)) {
      const current = this.peek()
      return this.scanner.source().slice(current.start, current.end)
    }

    return this.peek().value
  }

  literal() {
    if (this.check(Token.LITERAL)) {
      return new Expr.Literal(this.advance())
    }

    throw new ParseError(
      `Expected a literal${
        this.previous ? ` after '${this.previous!.value}'` : ""
      }, got '${this.stringify_current()}'.`
    )
  }

  motion() {
    if (this.match(Token.FORWARD)) {
      return new Expr.Forward(this.literal())
    }

    if (this.match(Token.TURN)) {
      return new Expr.Turn(this.literal())
    }

    throw new ParseError(`Expected motion keyword.`)
  }

  isAtEnd() {
    return this.peek().type == Token.EOF
  }

  advance() {
    this.previous = this.current
    this.current = this.scanner.next().value
    return this.previous
  }

  peek() {
    return this.current
  }

  consume(type: TokenType, msg: string) {
    if (this.check(type)) return this.advance()

    throw new ParseError(msg)
  }

  check(type: TokenType) {
    if (this.isAtEnd()) return false
    return this.peek().type == Token[type]
  }

  match(type: TokenType) {
    if (this.check(type)) {
      this.advance()
      return true
    }

    return false
  }

  command() {
    if (this.match(Token.REPEAT)) {
      return this.repeat()
    }

    return this.motion()
  }

  parse() {
    if (!this.check(Token.ERROR)) {
      return this.command()
    }

    this.error()
  }

  error() {
    const { value } = this.peek()
    throw new ParseError(value)
  }

  next() {
    if (!this.isAtEnd()) {
      return { done: false, value: this.parse() }
    }

    return { done: true }
  }

  [Symbol.iterator]() {
    return this
  }
}
