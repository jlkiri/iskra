import { Scanner, Parser, Compiler } from "iskra";

self.addEventListener("message", (event: MessageEvent<string>) => {
  try {
    const scanner = new Scanner(event.data);
    const parser = new Parser(scanner);
    const compiler = new Compiler();

    self.postMessage(compiler.compile_iter(parser));
  } catch {}
});
