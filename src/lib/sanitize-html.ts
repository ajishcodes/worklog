const ALLOWED_TAGS = new Set([
  "b",
  "strong",
  "i",
  "em",
  "u",
  "ul",
  "ol",
  "li",
  "a",
  "br",
  "div",
  "span",
  "p",
])

function sanitizeElement(element: Element) {
  for (const child of [...element.children]) {
    const tag = child.tagName.toLowerCase()

    if (!ALLOWED_TAGS.has(tag)) {
      child.replaceWith(...child.childNodes)
      continue
    }

    for (const attr of [...child.attributes]) {
      const isSafeHref =
        tag === "a" && attr.name === "href" && /^https?:\/\//i.test(attr.value)
      if (!isSafeHref) child.removeAttribute(attr.name)
    }

    if (tag === "a") {
      child.setAttribute("target", "_blank")
      child.setAttribute("rel", "noreferrer")
    }

    sanitizeElement(child)
  }
}

export function sanitizeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html")
  sanitizeElement(doc.body)
  return doc.body.innerHTML
}

export function isHtmlContentEmpty(html: string): boolean {
  return html.replace(/<[^>]*>/g, "").trim().length === 0
}
