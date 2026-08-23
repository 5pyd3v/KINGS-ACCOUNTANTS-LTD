import { sanitizeFactsheetHtml } from "@/lib/sanitize-html";
import { FACTSHEET_PROSE_CLASSES } from "@/lib/factsheet-prose";

/**
 * Renders factsheet body HTML (authored via the admin rich-text editor) with
 * styling matched to the site's type system. Blockquotes render as a
 * highlighted callout box, useful for worked examples or "how we can help"
 * notes. Sanitized again here, at render time, as defense in depth.
 */
export function FactsheetContent({ html }: { html: string }) {
  return (
    <div
      className={FACTSHEET_PROSE_CLASSES}
      dangerouslySetInnerHTML={{ __html: sanitizeFactsheetHtml(html) }}
    />
  );
}
