// Delar upp text från CMS:et i stycken. Tom rad = nytt stycke.
export const paragraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
