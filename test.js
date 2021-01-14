import { Scanner, Compiler, Parser } from "./dist/index.js"

// const scanner = new Scanner("repeat 4 (forward 90 left 45)")
// console.log(process.argv[2])

const scanner = new Scanner(process.argv[2])
const parser = new Parser(scanner)
const compiler = new Compiler()

console.log(compiler.compile_iter(parser))
