/**
 * Markdown utilities for parsing markdown text into Sanity Portable Text blocks and HTML
 */

export interface PortableTextSpan {
  _key: string;
  _type: 'span';
  text: string;
  marks: string[];
}

export interface PortableTextBlock {
  _key: string;
  _type: 'block';
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote';
  listItem?: 'bullet' | 'number';
  level?: number;
  children: PortableTextSpan[];
  markDefs: any[];
}

export function randomKey(): string {
  return Math.random().toString(36).substring(2, 10);
}

/**
 * Checks if a string contains Markdown syntax
 */
export function hasMarkdownSyntax(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const headingRegex = /^#{1,4}\s+\S+/m;
  const listRegex = /^[\s]*[-*+]\s+\S+/m;
  const numListRegex = /^[\s]*\d+\.\s+\S+/m;
  const quoteRegex = /^[\s]*>\s+\S+/m;
  const boldRegex = /\*\*[^*]+\*\*/;
  const italicRegex = /(?:^|[^*])\*[^*]+\*(?:[^*]|$)/;

  return (
    headingRegex.test(text) ||
    listRegex.test(text) ||
    numListRegex.test(text) ||
    quoteRegex.test(text) ||
    boldRegex.test(text) ||
    italicRegex.test(text)
  );
}

/**
 * Parses inline formatting (**bold**, *italic*, `code`) into Portable Text spans
 */
export function parseInlineSpans(text: string): PortableTextSpan[] {
  if (!text) {
    return [{ _key: randomKey(), _type: 'span', text: '', marks: [] }];
  }

  // Tokenize bold, italic, code
  // Regex matches:
  // 1: ***bold italic***
  // 2: **bold**
  // 3: *italic* or _italic_
  // 4: `code`
  const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;
  const parts = text.split(regex);
  const spans: PortableTextSpan[] = [];

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('***') && part.endsWith('***') && part.length > 6) {
      spans.push({
        _key: randomKey(),
        _type: 'span',
        text: part.slice(3, -3),
        marks: ['strong', 'em'],
      });
    } else if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      spans.push({
        _key: randomKey(),
        _type: 'span',
        text: part.slice(2, -2),
        marks: ['strong'],
      });
    } else if ((part.startsWith('*') && part.endsWith('*') && part.length > 2) ||
               (part.startsWith('_') && part.endsWith('_') && part.length > 2)) {
      spans.push({
        _key: randomKey(),
        _type: 'span',
        text: part.slice(1, -1),
        marks: ['em'],
      });
    } else if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      spans.push({
        _key: randomKey(),
        _type: 'span',
        text: part.slice(1, -1),
        marks: ['code'],
      });
    } else {
      spans.push({
        _key: randomKey(),
        _type: 'span',
        text: part,
        marks: [],
      });
    }
  }

  return spans.length > 0 ? spans : [{ _key: randomKey(), _type: 'span', text: '', marks: [] }];
}

/**
 * Converts a raw Markdown string into Sanity Portable Text blocks
 */
export function markdownToPortableTextBlocks(markdown: string): PortableTextBlock[] {
  if (!markdown || typeof markdown !== 'string') return [];

  const rawLines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: PortableTextBlock[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i];
    const trimmed = rawLine.trim();

    // Skip consecutive empty lines
    if (!trimmed) {
      continue;
    }

    // Heading 1: # Heading
    if (/^#\s+(.+)$/.test(trimmed)) {
      const content = trimmed.replace(/^#\s+/, '');
      blocks.push({
        _key: randomKey(),
        _type: 'block',
        style: 'h1',
        children: parseInlineSpans(content),
        markDefs: [],
      });
      continue;
    }

    // Heading 2: ## Heading
    if (/^##\s+(.+)$/.test(trimmed)) {
      const content = trimmed.replace(/^##\s+/, '');
      blocks.push({
        _key: randomKey(),
        _type: 'block',
        style: 'h2',
        children: parseInlineSpans(content),
        markDefs: [],
      });
      continue;
    }

    // Heading 3: ### Heading
    if (/^###\s+(.+)$/.test(trimmed)) {
      const content = trimmed.replace(/^###\s+/, '');
      blocks.push({
        _key: randomKey(),
        _type: 'block',
        style: 'h3',
        children: parseInlineSpans(content),
        markDefs: [],
      });
      continue;
    }

    // Heading 4: #### Heading
    if (/^####\s+(.+)$/.test(trimmed)) {
      const content = trimmed.replace(/^####\s+/, '');
      blocks.push({
        _key: randomKey(),
        _type: 'block',
        style: 'h4',
        children: parseInlineSpans(content),
        markDefs: [],
      });
      continue;
    }

    // Blockquote: > Quote
    if (/^>\s*(.+)$/.test(trimmed)) {
      const content = trimmed.replace(/^>\s*/, '');
      blocks.push({
        _key: randomKey(),
        _type: 'block',
        style: 'blockquote',
        children: parseInlineSpans(content),
        markDefs: [],
      });
      continue;
    }

    // Bullet List: - Item or * Item
    if (/^[-*+]\s+(.+)$/.test(trimmed)) {
      const content = trimmed.replace(/^[-*+]\s+/, '');
      blocks.push({
        _key: randomKey(),
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: parseInlineSpans(content),
        markDefs: [],
      });
      continue;
    }

    // Numbered List: 1. Item
    if (/^\d+\.\s+(.+)$/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s+/, '');
      blocks.push({
        _key: randomKey(),
        _type: 'block',
        style: 'normal',
        listItem: 'number',
        level: 1,
        children: parseInlineSpans(content),
        markDefs: [],
      });
      continue;
    }

    // Standard Paragraph
    blocks.push({
      _key: randomKey(),
      _type: 'block',
      style: 'normal',
      children: parseInlineSpans(trimmed),
      markDefs: [],
    });
  }

  return blocks;
}

/**
 * Converts Markdown string to clean semantic HTML
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown || typeof markdown !== 'string') return '';

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let inUl = false;
  let inOl = false;
  let inQuote = false;
  let quoteBuffer: string[] = [];

  function formatInline(str: string) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }

  function closeLists() {
    if (inUl) {
      html += '</ul>';
      inUl = false;
    }
    if (inOl) {
      html += '</ol>';
      inOl = false;
    }
    if (inQuote) {
      html += `<blockquote><p>${formatInline(quoteBuffer.join(' '))}</p></blockquote>`;
      inQuote = false;
      quoteBuffer = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      closeLists();
      continue;
    }

    // Heading 1
    if (/^#\s+(.+)$/.test(trimmed)) {
      closeLists();
      const text = trimmed.replace(/^#\s+/, '');
      html += `<h1>${formatInline(text)}</h1>`;
      continue;
    }

    // Heading 2
    if (/^##\s+(.+)$/.test(trimmed)) {
      closeLists();
      const text = trimmed.replace(/^##\s+/, '');
      html += `<h2>${formatInline(text)}</h2>`;
      continue;
    }

    // Heading 3
    if (/^###\s+(.+)$/.test(trimmed)) {
      closeLists();
      const text = trimmed.replace(/^###\s+/, '');
      html += `<h3>${formatInline(text)}</h3>`;
      continue;
    }

    // Heading 4
    if (/^####\s+(.+)$/.test(trimmed)) {
      closeLists();
      const text = trimmed.replace(/^####\s+/, '');
      html += `<h4>${formatInline(text)}</h4>`;
      continue;
    }

    // Blockquote
    if (/^>\s*(.+)$/.test(trimmed)) {
      if (inUl || inOl) closeLists();
      inQuote = true;
      quoteBuffer.push(trimmed.replace(/^>\s*/, ''));
      continue;
    } else if (inQuote) {
      closeLists();
    }

    // Bullet list
    if (/^[-*+]\s+(.+)$/.test(trimmed)) {
      if (inOl || inQuote) closeLists();
      if (!inUl) {
        html += '<ul>';
        inUl = true;
      }
      const text = trimmed.replace(/^[-*+]\s+/, '');
      html += `<li>${formatInline(text)}</li>`;
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+(.+)$/.test(trimmed)) {
      if (inUl || inQuote) closeLists();
      if (!inOl) {
        html += '<ol>';
        inOl = true;
      }
      const text = trimmed.replace(/^\d+\.\s+/, '');
      html += `<li>${formatInline(text)}</li>`;
      continue;
    }

    // Normal paragraph
    closeLists();
    html += `<p>${formatInline(trimmed)}</p>`;
  }

  closeLists();
  return html;
}
