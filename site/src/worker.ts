import { Scanner, Parser, Compiler } from "iskra";

self.addEventListener("message", (event: MessageEvent<string>) => {
  const scanner = new Scanner(event.data);
  const parser = new Parser(scanner);
  const compiler = new Compiler();

  try {
    const compiled = compiler.compile_iter(parser);
    self.postMessage({ error: null, compiled });
  } catch (e) {
    self.postMessage({ error: e, compiled: null });
  }
});
