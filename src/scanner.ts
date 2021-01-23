import { Token } from "./token.js"
import type { TokenType } from "./token.js"

export type SparkToken = {
  type: TokenType
  value: any
  start: number
  end: number
}

function return_iter(value: SparkToken) {
  return { done: false, value }
}

export class Scanner {
  private source: string
  private current: number
  private start: number
  private reserved: Map<string, TokenType>

  constructor(input: string) {
    this.source = input.replace(/\s/g, "")
    this.current = 0
    this.start = 0

    this.reserved = new Map()

    this.reserved.set("repeat", Token.REPEAT)
    this.reserved.set("forward", Token.FORWARD)
    this.reserved.set("turn", Token.TURN)
  }

  next() {
    this.start = this.current

    if (this.isAtEnd()) {
      return {
        done: true,
        value: this.create_token(Token.EOF),
      }
    }

    const char = this.advance()

    if (this.is_alpha(char)) {
      return return_iter(this.keyword())
    }

    if (this.is_numeric(char)) {
      return return_iter(this.number())
    }

    switch (char) {
      case "(":
        return return_iter(this.create_token(Token.OB))
      case ")":
        return return_iter(this.create_token(Token.CB))
    }

    return return_iter(
      this.create_token(Token.ERROR, `Unexpected token: ${char}.`)
    )
  }

  create_token(type: TokenType, value?: any): SparkToken {
    return {
      type,
      value,
      start: this.start,
      end: this.current,
    }
  }

  is_alpha(char: string) {
    return /[a-zA-Z]/.test(char)
  }

  is_numeric(char: string) {
    return /[0-9]/.test(char)
  }

  is_reserved(char: string) {
    return this.reserved.has(char)
  }

  current_slice() {
    return this.source.slice(this.start, this.current)
  }

  peek() {
    return this.source.charAt(this.current)
  }

  keyword() {
    while (this.is_alpha(this.peek())) {
      this.advance()
    }

    const slice = this.current_slice()

    if (this.is_reserved(slice)) {
      return this.create_token(this.reserved.get(slice)!, slice)
    }

    return this.create_token(
      Token.ERROR,
      `Unexpected token: ${this.current_slice()}`
    )
  }

  number() {
    while (this.is_numeric(this.peek())) {
      this.advance()
    }

    return this.create_token(Token.LITERAL, this.current_slice())
  }

  isAtEnd() {
    return this.current >= this.source.length
  }

  advance() {
    this.current += 1
    return this.source.charAt(this.current - 1)
  }

  [Symbol.iterator]() {
    return this
  }
}
