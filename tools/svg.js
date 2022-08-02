customElements.define("load-file", class extends HTMLElement {
  async connectedCallback(
    src = this.getAttribute("src"),
    shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
  ) {
    shadowRoot.innerHTML = await (await fetch(src)).text()
    shadowRoot.append(...this.querySelectorAll("[shadowRoot]"))

    // 注入 part 属性，穿透shadowRoot
    shadowRoot.childNodes.forEach((item,i)=>{
      item.children?.forEach((o,j)=>{
        o.setAttribute("part","svg")
      })
    })

    this.hasAttribute("replaceWith") && this.replaceWith(...shadowRoot.childNodes)
  }
})