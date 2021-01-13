import * as Expr from "./expr.js";
import { Parser } from "./parser.js";

export interface ExprVisitor<T> {
  visitLiteralExpr(expr: Expr.Literal): T;
  visitRepeatExpr(expr: Expr.Repeat): T;
  visitForwardExpr(expr: Expr.Forward): T;
  visitRightExpr(expr: Expr.Right): T;
  visitLeftExpr(expr: Expr.Left): T;
}

export class Compiler implements ExprVisitor<string> {
  private code: Array<String>;

  constructor() {
    this.evaluate = this.evaluate.bind(this);
    this.code = [];
  }

  visitLiteralExpr(expr: Expr.Literal) {
    return expr.value;
  }

  visitRepeatExpr(expr: Expr.Repeat) {
    return `
      for (let i = 0; i < ${this.evaluate(expr.times)}; i++) {
        ${expr.movements.map(this.evaluate).join(";\n")}
      }
    `;
  }

  visitForwardExpr(expr: Expr.Forward) {
    return `ctx.moveTo(${this.evaluate(expr.distance)}, 0)`;
  }

  visitRightExpr(expr: Expr.Right) {
    return `ctx.moveTo(${this.evaluate(expr.distance)}, 0)`;
  }

  visitLeftExpr(expr: Expr.Left) {
    return `ctx.moveTo(${this.evaluate(expr.distance)}, 0)`;
  }

  evaluate(expr: Expr.Visitable<string>): any {
    return expr.accept(this);
  }

  compile_iter(parser: Parser) {
    for (const expr of parser) {
      this.code.push(this.evaluate(expr!));
    }

    return `
      function draw(ctx) { ${this.code.join("\n")} }
    `;
  }
}
