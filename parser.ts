import { Scanner } from "./scanner";
import type { TokenType } from "./token";

export class Parser {
  private scanner: Scanner;

  constructor(scanner: Scanner) {
    this.scanner = scanner;
  }

  repeat() {}

  /* peek() {
    return this.current;
  }

  check(type: TokenType) {
    this.
  }

  match(type: TokenType) {
    if (this.check(type)) {
      this.advance();
    }
  } */

  command() {
    // if
    return this.repeat();
  }

  parse() {
    console.log(this.scanner.next());
    /* for (const token of this.scanner) {
      console.log(token);
    } */
  }
}

const scanner = new Scanner("repeat 90 (forward 30) right 40");
const parser = new Parser(scanner);

parser.parse();
