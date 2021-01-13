import { Token } from "./token";
import type { TokenType } from "./token";

function return_iter(value: any) {
  return { done: false, value };
}

function create_token(type: TokenType, value?: any) {
  return {
    type,
    value,
  };
}

export class Scanner {
  private source: string;
  private current: number;
  private start: number;
  private reserved: Map<string, TokenType>;

  constructor(input: string) {
    this.source = input.replace(/\s/g, "");
    this.current = 0;
    this.start = 0;

    this.reserved = new Map();
    this.reserved.set("repeat", Token.REPEAT);
  }

  next() {
    this.start = this.current;

    if (this.isAtEnd()) {
      return { done: true, value: null };
    }

    const char = this.advance();

    if (this.is_alpha(char)) {
      return return_iter(this.keyword());
    }

    if (this.is_numeric(char)) {
      return return_iter(this.number());
    }

    switch (char) {
      case "(":
        return return_iter(create_token(Token.LB));
      case ")":
        return return_iter(create_token(Token.RB));
    }

    return return_iter(char);
  }

  is_alpha(char: string) {
    return /[a-zA-Z]/.test(char);
  }

  is_numeric(char: string) {
    return /[0-9]/.test(char);
  }

  is_reserved(char: string) {
    return this.reserved.has(char);
  }

  current_slice() {
    return this.source.slice(this.start, this.current);
  }

  peek() {
    return this.source.charAt(this.current);
  }

  keyword() {
    while (this.is_alpha(this.peek())) {
      this.advance();
    }

    const slice = this.current_slice();

    if (this.is_reserved(slice)) {
      return create_token(this.reserved.get(slice)!, slice);
    }

    return create_token(Token.KEYWORD, this.current_slice());
  }

  number() {
    while (this.is_numeric(this.peek())) {
      this.advance();
    }

    return create_token(Token.INTEGER, this.current_slice());
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  advance() {
    this.current += 1;
    return this.source.charAt(this.current - 1);
  }

  [Symbol.iterator]() {
    return this;
  }
}
