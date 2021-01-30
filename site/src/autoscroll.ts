import { afterUpdate } from "svelte"

export function autoscroll(node) {
  setTimeout(() => {
    if (node.scrollHeight > node.clientHeight) {
      node.scrollTo(0, node.scrollHeight - node.clientHeight)
    }
  }, 500)
}
