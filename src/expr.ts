import { SparkToken } from "./scanner.js";

export class Forward {
  private distance: Literal;

  constructor(distance: Literal) {
    this.distance = distance;
  }
}

export class Literal {
  private value: number;

  constructor(token: SparkToken) {
    this.value = token.value;
  }
}
