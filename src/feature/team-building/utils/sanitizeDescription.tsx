const FIGURE_PATTERN = /<figure[^>]*>[\s\S]*?<\/figure>/gi;
const IMAGE_PATTERN = /<img[^>]*>/gi;
const BACKGROUND_STYLE_PATTERN = /style="[^"]*background(?:-image)?\s*:[^";]*[^"]*"/gi;
const BACKGROUND_DECLARATION_PATTERN = /background(?:-image)?\s*:[^;"]*;?/gi;
const stripBackgroundStyles = (input: string): string =>
  input.replace(BACKGROUND_STYLE_PATTERN, match => {
    const sanitized = match.replace(BACKGROUND_DECLARATION_PATTERN, '').replace(/\s{2,}/g, ' ').trim();
    return sanitized === 'style=""' ? '' : sanitized;
  });
const stripFigureAndImageTags = (input: string): string =>
  stripBackgroundStyles(input.replace(FIGURE_PATTERN, '').replace(IMAGE_PATTERN, ''));
const stripDomNodes = (input: string): string => {
  if (typeof window === 'undefined' || !window.document) {
    return input;
  }
  const container = window.document.createElement('div');
  container.innerHTML = input;
  container.querySelectorAll('img, figure').forEach(node => node.remove());
  container.querySelectorAll('[style]').forEach(node => {
    const style = node.getAttribute('style');
    if (!style) return;
    const filtered = style
      .split(';')
      .map(part => part.trim())
      .filter(part => part && !/^background(?:-image)?\s*:/i.test(part));
    if (filtered.length === 0) {
      node.removeAttribute('style');
    } else {
      node.setAttribute('style', filtered.join('; '));
    }
  });
  return container.innerHTML;
};
export const sanitizeDescription = (value?: string | null): string => {
  if (!value) return '';
  const withoutImageMarkup = stripFigureAndImageTags(value);
  return stripDomNodes(withoutImageMarkup);
};
export const ensureSanitizedDescription = (value?: string | null): string =>
  sanitizeDescription(value);
