import * as Expr from "./expr.js";

export interface ExprVisitor<T> {
  visitLiteralExpr(expr: Expr.Literal): T;
  visitRepeatExpr(expr: Expr.Repeat): T;
  visitForwardExpr(expr: Expr.Forward): T;
  visitRightExpr(expr: Expr.Right): T;
  visitLeftExpr(expr: Expr.Left): T;
}

export class Compiler implements ExprVisitor<string> {
  visitLiteralExpr(expr: Expr.Literal) {
    return "";
  }

  visitRepeatExpr(expr: Expr.Repeat) {
    return "";
  }

  visitForwardExpr(expr: Expr.Forward) {
    return "";
  }

  visitRightExpr(expr: Expr.Right) {
    return "";
  }

  visitLeftExpr(expr: Expr.Left) {
    return "";
  }

  evaluate(expr: Expr.Visitable<string>) {
    expr.accept(this);
  }
}
