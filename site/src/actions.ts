export function clickOutside(node: HTMLElement, initialOpen: boolean) {
  let isOpen = initialOpen

  function handleOutsideClick({ target }: MouseEvent) {
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
    },
  }
}
