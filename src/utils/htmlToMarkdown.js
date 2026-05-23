/**
 * Converts the custom HTML produced by RichTextInput back into standard Markdown.
 * - <br> or <div> -> \n
 * - <strong>text</strong> -> **text**
 * - <code>text</code> -> `text`
 * - &nbsp; -> space
 */
export function htmlToMarkdown(html) {
  if (!html) return ''
  
  // Create a temporary DOM element to parse HTML safely
  const temp = document.createElement('div')
  temp.innerHTML = html

  // Recursively process nodes
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Replace non-breaking spaces with normal spaces
      return node.textContent.replace(/\u00A0/g, ' ')
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return ''
    }

    const tagName = node.tagName.toLowerCase()
    let innerMarkdown = ''
    
    // Process children
    for (const child of Array.from(node.childNodes)) {
      innerMarkdown += processNode(child)
    }

    // Apply markdown wrappers based on tag
    switch (tagName) {
      case 'strong':
      case 'b':
        return `**${innerMarkdown}**`
      case 'em':
      case 'i':
        return `_${innerMarkdown}_`
      case 'code':
        return `\`${innerMarkdown}\``
      case 'br':
        return '\n'
      case 'div':
      case 'p':
        // For block elements, append newline if it's not the last node
        return `\n${innerMarkdown}`
      default:
        return innerMarkdown
    }
  }

  let markdown = ''
  for (const child of Array.from(temp.childNodes)) {
    markdown += processNode(child)
  }

  // Clean up excessive newlines
  return markdown.replace(/\n{3,}/g, '\n\n').trim()
}
