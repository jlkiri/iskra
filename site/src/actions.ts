import { afterUpdate } from "svelte"

export function autoscroll(node) {
  function scroll() {
    if (node.scrollHeight > node.clientHeight) {
      node.scrollTo(0, node.scrollHeight - node.clientHeight)
    }
  }

  scroll()

  afterUpdate(() => {
    scroll()
  })
}
