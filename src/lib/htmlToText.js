import { htmlToText } from "html-to-text";

export function extractTextFromHtml(html) {
  return htmlToText(html, {
  selectors: [
      // Keep only <p> and <div>, skip everything else
      { selector: 'p', format: 'inline' },
      { selector: 'div', format: 'inline' },
      { selector: 'h1', format: 'skip' },
      { selector: 'h2', format: 'skip' },
      { selector: 'h3', format: 'skip' },
      { selector: 'h4', format: 'skip' },
      { selector: 'h5', format: 'skip' },
      { selector: 'h6', format: 'skip' },
      { selector: 'b', format: 'skip' },
      { selector: 'strong', format: 'inline' },
      { selector: 'code', format: 'skip' },
      { selector: 'pre', format: 'skip' },
      { selector: 'img', format: 'skip' },
      { selector: 'script', format: 'skip' },
      { selector: 'style', format: 'skip' },
      { selector: 'iframe', format: 'skip' },
    ]
  }).replace(/\t/g, '');
}
