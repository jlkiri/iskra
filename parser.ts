import { Scanner } from "./scanner.js";
let iter = new Scanner("repeat 90 (forward 30) right 40");
for (const token of iter) {
  console.log(token);
}
