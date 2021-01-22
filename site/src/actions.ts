export function clickOutside(node: HTMLElement, initialOpen: boolean) {
  let isOpen = initialOpen

  console.log("initialOpen", initialOpen)

  function handleOutsideClick({ target }: MouseEvent) {
    console.log("isOpen", isOpen)
    if (node && !node.contains(target as Node) && isOpen) {
      node.dispatchEvent(new CustomEvent("clickOutside"))
    }
  }

  window.addEventListener("click", handleOutsideClick)

  return {
    update(newState) {
      isOpen = newState
    },
    destroy() {
      window.removeEventListener("click", handleOutsideClick)
    }
  }
}
