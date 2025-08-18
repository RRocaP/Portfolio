import { createElement, type ReactNode } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface ReadingTimeResult {
  minutes: number;
  words: number;
}

// Default components for MDX rendering
const defaultComponents = {
  h1: (props: any) => createElement('h1', { ...props, className: 'text-4xl font-bold mb-6 text-white' }),
  h2: (props: any) => createElement('h2', { ...props, className: 'text-3xl font-semibold mb-5 text-white' }),
  h3: (props: any) => createElement('h3', { ...props, className: 'text-2xl font-medium mb-4 text-white' }),
  h4: (props: any) => createElement('h4', { ...props, className: 'text-xl font-medium mb-3 text-white' }),
  h5: (props: any) => createElement('h5', { ...props, className: 'text-lg font-medium mb-2 text-white' }),
  h6: (props: any) => createElement('h6', { ...props, className: 'text-base font-medium mb-2 text-white' }),
  p: (props: any) => createElement('p', { ...props, className: 'mb-4 text-gray-300 leading-relaxed' }),
  a: (props: any) => createElement('a', { 
    ...props, 
    className: 'text-red-400 hover:text-red-300 underline transition-colors',
    target: props.href?.startsWith('http') ? '_blank' : undefined,
    rel: props.href?.startsWith('http') ? 'noopener noreferrer' : undefined
  }),
  ul: (props: any) => createElement('ul', { ...props, className: 'mb-4 list-disc list-inside text-gray-300 space-y-2' }),
  ol: (props: any) => createElement('ol', { ...props, className: 'mb-4 list-decimal list-inside text-gray-300 space-y-2' }),
  li: (props: any) => createElement('li', { ...props, className: 'text-gray-300' }),
  blockquote: (props: any) => createElement('blockquote', { 
    ...props, 
    className: 'border-l-4 border-red-500 pl-4 mb-4 italic text-gray-400 bg-gray-800/30 py-2 rounded-r'
  }),
  code: (props: any) => {
    const { children, className, ...rest } = props;
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    if (language) {
      // Block code with syntax highlighting
      const highlighted = Prism.highlight(
        String(children).replace(/\n$/, ''),
        Prism.languages[language] || Prism.languages.text,
        language
      );
      
      return createElement('pre', {
        className: 'mb-4 p-4 bg-gray-900 rounded-lg overflow-x-auto border border-gray-700'
      }, [
        createElement('code', {
          className: `language-${language} text-sm`,
          dangerouslySetInnerHTML: { __html: highlighted }
        })
      ]);
    }
    
    // Inline code
    return createElement('code', {
      ...rest,
      className: 'px-2 py-1 bg-gray-800 text-yellow-400 rounded text-sm font-mono'
    }, children);
  },
  pre: (props: any) => {
    // If pre contains code with language, let code component handle it
    if (props.children?.props?.className?.includes('language-')) {
      return props.children;
    }
    return createElement('pre', { 
      ...props, 
      className: 'mb-4 p-4 bg-gray-900 rounded-lg overflow-x-auto border border-gray-700 text-sm'
    });
  },
  table: (props: any) => createElement('div', { className: 'overflow-x-auto mb-4' }, [
    createElement('table', { ...props, className: 'min-w-full border-collapse border border-gray-700' })
  ]),
  thead: (props: any) => createElement('thead', { ...props, className: 'bg-gray-800' }),
  tbody: (props: any) => createElement('tbody', props),
  tr: (props: any) => createElement('tr', { ...props, className: 'border-b border-gray-700' }),
  th: (props: any) => createElement('th', { 
    ...props, 
    className: 'border border-gray-700 px-4 py-2 text-left font-semibold text-white'
  }),
  td: (props: any) => createElement('td', { 
    ...props, 
    className: 'border border-gray-700 px-4 py-2 text-gray-300'
  }),
  hr: (props: any) => createElement('hr', { ...props, className: 'my-8 border-gray-700' }),
  img: (props: any) => createElement('img', { 
    ...props, 
    className: 'max-w-full h-auto rounded-lg mb-4',
    loading: 'lazy'
  }),
  strong: (props: any) => createElement('strong', { ...props, className: 'font-bold text-white' }),
  em: (props: any) => createElement('em', { ...props, className: 'italic text-gray-200' }),
};

/**
 * Simple markdown to React renderer with syntax highlighting
 */
export function renderMDXToReact(
  markdown: string, 
  components: Record<string, any> = {}
): ReactNode {
  const mergedComponents = { ...defaultComponents, ...components };
  
  // Simple markdown parser
  const lines = markdown.split('\n');
  const elements: ReactNode[] = [];
  let currentElement: { type: string; content: string; level?: number; lang?: string } | null = null;
  
  const flushCurrentElement = () => {
    if (!currentElement) return;
    
    const { type, content, level, lang } = currentElement;
    
    switch (type) {
      case 'heading':
        const HeadingComponent = mergedComponents[`h${level}`] || mergedComponents.h1;
        const id = content.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        elements.push(createElement(HeadingComponent, { key: elements.length, id }, content));
        break;
        
      case 'paragraph':
        if (content.trim()) {
          elements.push(createElement(mergedComponents.p, { key: elements.length }, parseInlineElements(content, mergedComponents)));
        }
        break;
        
      case 'code':
        elements.push(createElement(mergedComponents.code, { 
          key: elements.length, 
          className: lang ? `language-${lang}` : undefined 
        }, content));
        break;
        
      case 'blockquote':
        elements.push(createElement(mergedComponents.blockquote, { key: elements.length }, content));
        break;
        
      case 'list':
        const listItems = content.split('\n').filter(line => line.trim()).map((item, idx) => 
          createElement(mergedComponents.li, { key: idx }, parseInlineElements(item.replace(/^[-*+]\s+/, ''), mergedComponents))
        );
        elements.push(createElement(mergedComponents.ul, { key: elements.length }, listItems));
        break;
    }
    
    currentElement = null;
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Code blocks
    if (line.startsWith('```')) {
      flushCurrentElement();
      const lang = line.slice(3).trim();
      const codeLines = [];
      i++;
      
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      
      currentElement = { type: 'code', content: codeLines.join('\n'), lang };
      flushCurrentElement();
      continue;
    }
    
    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushCurrentElement();
      currentElement = { 
        type: 'heading', 
        content: headingMatch[2], 
        level: headingMatch[1].length 
      };
      flushCurrentElement();
      continue;
    }
    
    // Blockquotes
    if (line.startsWith('> ')) {
      if (currentElement?.type !== 'blockquote') {
        flushCurrentElement();
        currentElement = { type: 'blockquote', content: '' };
      }
      currentElement.content += (currentElement.content ? '\n' : '') + line.slice(2);
      continue;
    }
    
    // Lists
    if (line.match(/^[-*+]\s+/)) {
      if (currentElement?.type !== 'list') {
        flushCurrentElement();
        currentElement = { type: 'list', content: '' };
      }
      currentElement.content += (currentElement.content ? '\n' : '') + line;
      continue;
    }
    
    // Horizontal rule
    if (line.match(/^---+$/) || line.match(/^\*\*\*+$/)) {
      flushCurrentElement();
      elements.push(createElement(mergedComponents.hr, { key: elements.length }));
      continue;
    }
    
    // Empty line - flush current element
    if (!line.trim()) {
      flushCurrentElement();
      continue;
    }
    
    // Regular paragraph
    if (currentElement?.type !== 'paragraph') {
      flushCurrentElement();
      currentElement = { type: 'paragraph', content: '' };
    }
    currentElement.content += (currentElement.content ? ' ' : '') + line;
  }
  
  flushCurrentElement();
  
  return createElement('div', { className: 'prose prose-invert max-w-none' }, elements);
}

/**
 * Parse inline elements like links, code, bold, italic
 */
function parseInlineElements(text: string, components: Record<string, any>): ReactNode[] {
  const elements: ReactNode[] = [];
  let remaining = text;
  let key = 0;
  
  while (remaining) {
    // Inline code
    const codeMatch = remaining.match(/`([^`]+)`/);
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) {
        elements.push(remaining.slice(0, codeMatch.index));
      }
      elements.push(createElement(components.code, { key: key++ }, codeMatch[1]));
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
      continue;
    }
    
    // Links
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch && linkMatch.index !== undefined) {
      if (linkMatch.index > 0) {
        elements.push(remaining.slice(0, linkMatch.index));
      }
      elements.push(createElement(components.a, { 
        key: key++, 
        href: linkMatch[2] 
      }, linkMatch[1]));
      remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
      continue;
    }
    
    // Bold
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        elements.push(remaining.slice(0, boldMatch.index));
      }
      elements.push(createElement(components.strong, { key: key++ }, boldMatch[1]));
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }
    
    // Italic
    const italicMatch = remaining.match(/\*([^*]+)\*/);
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) {
        elements.push(remaining.slice(0, italicMatch.index));
      }
      elements.push(createElement(components.em, { key: key++ }, italicMatch[1]));
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
      continue;
    }
    
    // No more matches, add remaining text
    elements.push(remaining);
    break;
  }
  
  return elements.filter(el => el !== '');
}

/**
 * Extract table of contents from markdown
 */
export function getTOC(markdown: string): TocItem[] {
  const toc: TocItem[] = [];
  const lines = markdown.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2];
      const id = text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      toc.push({ id, text, level });
    }
  }
  
  return toc;
}

/**
 * Calculate reading time based on average reading speed
 */
export function getReadingTime(markdown: string): ReadingTimeResult {
  // Remove markdown syntax and count words
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links with link text
    .replace(/[#*_~`]/g, '') // Remove markdown syntax
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  const words = plainText ? plainText.split(/\s+/).length : 0;
  
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  
  return { minutes, words };
}

/**
 * Generate SEO-friendly excerpt from markdown
 */
export function getExcerpt(markdown: string, maxLength: number = 160): string {
  const plainText = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  const truncated = plainText.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.slice(0, lastSpace) + '...'
    : truncated + '...';
}

/**
 * Extract first image from markdown content
 */
export function getFirstImage(markdown: string): string | null {
  const imageMatch = markdown.match(/!\[([^\]]*)\]\(([^)]+)\)/);
  return imageMatch ? imageMatch[2] : null;
}

export default {
  renderMDXToReact,
  getTOC,
  getReadingTime,
  getExcerpt,
  getFirstImage
};