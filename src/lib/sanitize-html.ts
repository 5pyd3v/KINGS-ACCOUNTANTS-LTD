import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitizes rich-text HTML produced by the admin factsheet editor.
 *
 * Used at two points: when the API saves a factsheet body (the important
 * one — the API is the actual trust boundary, since it accepts raw HTML
 * over the wire regardless of what the editor UI itself would produce),
 * and again at render time as cheap defense in depth.
 *
 * Allowlist matches exactly what the Tiptap toolbar can produce: headings,
 * paragraphs, lists, emphasis, links, and inline color/font-size styling.
 */
export function sanitizeFactsheetHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "h2",
      "h3",
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "span",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "style"],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i,
  }).trim();
}
