import App from "./App.svelte";
import * as Iskra from "iskra";

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

export default app;
