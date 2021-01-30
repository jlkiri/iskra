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

export function pannable(node) {
  let x
  let y

  function handleMousedown(event) {
    x = event.clientX
    y = event.clientY

    node.dispatchEvent(
      new CustomEvent("panstart", {
        detail: { x, y },
      })
    )

    window.addEventListener("mousemove", handleMousemove)
    window.addEventListener("mouseup", handleMouseup)
  }

  function handleMousemove(event) {
    const dx = event.clientX - x
    const dy = event.clientY - y
    x = event.clientX
    y = event.clientY

    console.log(x, y)

    node.dispatchEvent(
      new CustomEvent("panmove", {
        detail: { x, y, dx, dy },
      })
    )
  }

  function handleMouseup(event) {
    const dx = event.clientX - x
    const dy = event.clientY - y
    x = event.clientX
    y = event.clientY

    node.dispatchEvent(
      new CustomEvent("panend", {
        detail: { x, y, dx, dy },
      })
    )

    window.removeEventListener("mousemove", handleMousemove)
    window.removeEventListener("mouseup", handleMouseup)
  }

  node.addEventListener("mousedown", handleMousedown)

  return {
    destroy() {
      node.removeEventListener("mousedown", handleMousedown)
    },
  }
}
