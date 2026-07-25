const ALLOWED_TAGS = new Set([
  'a', 'article', 'b', 'blockquote', 'br', 'code', 'dd', 'div', 'dl', 'dt',
  'em', 'figure', 'figcaption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
  'i', 'img', 'li', 'ol', 'p', 'pre', 'section', 'small', 'span', 'strong',
  'sub', 'sup', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'u', 'ul',
]);

const DROP_WITH_CONTENT = new Set([
  'audio', 'button', 'canvas', 'embed', 'form', 'iframe', 'input', 'link',
  'math', 'meta', 'object', 'script', 'select', 'style', 'svg', 'textarea',
  'video',
]);

const GLOBAL_ATTRIBUTES = new Set(['class', 'dir', 'lang', 'title']);
const TAG_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(['href', 'rel', 'target']),
  img: new Set(['alt', 'decoding', 'height', 'loading', 'src', 'width']),
  td: new Set(['colspan', 'rowspan']),
  th: new Set(['colspan', 'rowspan', 'scope']),
};

function isSafeUrl(value: string, kind: 'href' | 'src') {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) return true;

  try {
    const url = new URL(trimmed, window.location.origin);
    if (kind === 'src') return url.protocol === 'https:' || url.origin === window.location.origin;
    return ['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function cleanElement(element: Element) {
  const tag = element.tagName.toLowerCase();

  for (const attribute of Array.from(element.attributes)) {
    const name = attribute.name.toLowerCase();
    const isAllowed = GLOBAL_ATTRIBUTES.has(name) || (TAG_ATTRIBUTES[tag]?.has(name) ?? false);

    if (!isAllowed || name.startsWith('on') || name === 'style' || name === 'srcdoc') {
      element.removeAttribute(attribute.name);
      continue;
    }

    if ((name === 'href' || name === 'src') && !isSafeUrl(attribute.value, name)) {
      element.removeAttribute(attribute.name);
    }
  }

  if (tag === 'a' && element.getAttribute('target') === '_blank') {
    element.setAttribute('rel', 'noopener noreferrer');
  }

  if (tag === 'img') {
    element.setAttribute('loading', element.getAttribute('loading') || 'lazy');
    element.setAttribute('decoding', element.getAttribute('decoding') || 'async');
  }
}

/**
 * Sanitizes CMS and policy HTML before it reaches React's HTML rendering escape
 * hatch. Scripts, embedded documents, forms, event handlers, inline styles,
 * SVG, and unsafe URL schemes are intentionally excluded.
 */
export function sanitizeHtml(value: string) {
  if (!value || typeof window === 'undefined' || typeof DOMParser === 'undefined') return '';

  const document = new DOMParser().parseFromString(value, 'text/html');
  const elements = Array.from(document.body.querySelectorAll('*')).reverse();

  for (const element of elements) {
    const tag = element.tagName.toLowerCase();
    if (DROP_WITH_CONTENT.has(tag)) {
      element.remove();
    } else if (!ALLOWED_TAGS.has(tag)) {
      element.replaceWith(...Array.from(element.childNodes));
    } else {
      cleanElement(element);
    }
  }

  return document.body.innerHTML;
}
