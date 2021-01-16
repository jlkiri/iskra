const Token = {
    FORWARD: "FORWARD",
    RIGHT: "RIGHT",
    LEFT: "LEFT",
    LITERAL: "LITERAL",
    REPEAT: "REPEAT",
    OB: "OB",
    CB: "CB",
    ERROR: "ERROR",
    EOF: "EOF",
};

class Forward {
    constructor(distance) {
        this.distance = distance;
    }
    accept(visitor) {
        return visitor.visitForwardExpr(this);
    }
}
class Right {
    constructor(distance) {
        this.distance = distance;
    }
    accept(visitor) {
        return visitor.visitRightExpr(this);
    }
}
class Left {
    constructor(distance) {
        this.distance = distance;
    }
    accept(visitor) {
        return visitor.visitLeftExpr(this);
    }
}
class Literal {
    constructor(token) {
        this.value = token.value;
    }
    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}
class Repeat {
    constructor(times, movements) {
        this.times = times;
        this.movements = movements;
    }
    accept(visitor) {
        return visitor.visitRepeatExpr(this);
    }
}

class Parser {
    constructor(scanner) {
        this.scanner = scanner;
        this.current = this.scanner.next().value;
        this.previous = null;
    }
    repeat() {
        const times = this.literal();
        const movements = [];
        this.consume(Token.OB, `Expected a '(' ${JSON.stringify(this.current)}`);
        while (!this.check(Token.CB)) {
            movements.push(this.command());
        }
        this.consume(Token.CB, `Expected a ')' `);
        return new Repeat(times, movements);
    }
    literal() {
        if (this.check(Token.LITERAL)) {
            return new Literal(this.advance());
        }
        throw new Error(`Expected literal: ${JSON.stringify(this.current)}`);
    }
    motion() {
        if (this.match(Token.FORWARD)) {
            return new Forward(this.literal());
        }
        if (this.match(Token.LEFT)) {
            return new Left(this.literal());
        }
        if (this.match(Token.RIGHT)) {
            return new Right(this.literal());
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
    consume(type, msg) {
        if (this.check(type))
            return this.advance();
        throw new Error(msg);
    }
    check(type) {
        if (this.isAtEnd())
            return false;
        return this.peek().type == Token[type];
    }
    match(type) {
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
        return this.command();
    }
    next() {
        if (!this.isAtEnd()) {
            return { done: false, value: this.parse() };
        }
        return { done: true };
    }
    [Symbol.iterator]() {
        return this;
    }
}
/* fs.writeFileSync("output.js", compiler.compile_iter(parser), {
  encoding: "utf8",
}); */

class Compiler {
    constructor() {
        this.evaluate = this.evaluate.bind(this);
        this.code = [];
    }
    visitLiteralExpr(expr) {
        return expr.value;
    }
    visitRepeatExpr(expr) {
        return `
      for (let i = 0; i < ${this.evaluate(expr.times)}; i++) {
        ${expr.movements.map(this.evaluate).join("\n")}
      }\n
    `;
    }
    visitForwardExpr(expr) {
        return `
      await drawLine(${this.evaluate(expr.distance)});
      ctx.translate(${this.evaluate(expr.distance)}, 0);
    `;
    }
    visitRightExpr(expr) {
        return `
      ctx.rotate(${this.evaluate(expr.distance)} * Math.PI / 180);
    `;
    }
    visitLeftExpr(expr) {
        return `ctx.rotate(-${this.evaluate(expr.distance)} * Math.PI / 180);`;
    }
    evaluate(expr) {
        return expr.accept(this);
    }
    compile_iter(parser) {
        for (const expr of parser) {
            this.code.push(this.evaluate(expr));
        }
        return `
      export default async function draw(ctx, drawLine) { 
        ${this.code.join("\n")}
      }
  `;
    }
}

function return_iter(value) {
    return { done: false, value };
}
function create_token(type, value) {
    return {
        type,
        value,
    };
}
class Scanner {
    constructor(input) {
        this.source = input.replace(/\s/g, "");
        this.current = 0;
        this.start = 0;
        this.reserved = new Map();
        this.reserved.set("repeat", Token.REPEAT);
        this.reserved.set("forward", Token.FORWARD);
        this.reserved.set("right", Token.RIGHT);
        this.reserved.set("left", Token.LEFT);
    }
    next() {
        this.start = this.current;
        if (this.isAtEnd()) {
            return { done: true, value: create_token(Token.EOF) };
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
                return return_iter(create_token(Token.OB));
            case ")":
                return return_iter(create_token(Token.CB));
        }
        return return_iter(create_token(Token.ERROR, `Unexpected token: ${char}.`));
    }
    is_alpha(char) {
        return /[a-zA-Z]/.test(char);
    }
    is_numeric(char) {
        return /[0-9]/.test(char);
    }
    is_reserved(char) {
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
            return create_token(this.reserved.get(slice), slice);
        }
        return create_token(Token.ERROR, `Unexpected token: ${this.current_slice()}`);
    }
    number() {
        while (this.is_numeric(this.peek())) {
            this.advance();
        }
        return create_token(Token.LITERAL, this.current_slice());
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

self.addEventListener("message", (event) => {
    const scanner = new Scanner(event.data);
    const parser = new Parser(scanner);
    const compiler = new Compiler();
    self.postMessage(compiler.compile_iter(parser));
});
//# sourceMappingURL=worker.js.map
