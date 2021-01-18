import { ExprVisitor } from "./compiler.js"
import { SparkToken } from "./scanner.js"

export type Motion = Forward | Turn

export interface Visitable<T> {
  accept(visitor: ExprVisitor<T>): T
}

export class Forward implements Visitable<string> {
  distance: Literal

  constructor(distance: Literal) {
    this.distance = distance
  }

  accept(visitor: ExprVisitor<string>) {
    return visitor.visitForwardExpr(this)
  }
}

export class Turn implements Visitable<string> {
  distance: Literal

  constructor(distance: Literal) {
    this.distance = distance
  }

  accept(visitor: ExprVisitor<string>) {
    return visitor.visitTurnExpr(this)
  }
}

export class Literal implements Visitable<string> {
  value: string

  constructor(token: SparkToken) {
    this.value = token.value
  }

  accept(visitor: ExprVisitor<string>) {
    return visitor.visitLiteralExpr(this)
  }
}

export class Repeat implements Visitable<string> {
  movements: Array<Motion | Repeat>
  times: Literal

  constructor(times: Literal, movements: Array<Motion | Repeat>) {
    this.times = times
    this.movements = movements
  }

  accept(visitor: ExprVisitor<string>) {
    return visitor.visitRepeatExpr(this)
  }
}
