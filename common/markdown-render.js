import {marked} from "marked";
import DOMPurify from "dompurify";
// Markdown to sanitised HTML. Used by the article page and the blog editor preview,
// so the preview matches what is published. Browser only: DOMPurify needs a DOM.
export const renderMarkdown = (text) => {
    const html = marked.parse(String(text ?? '')).toString();
    return typeof window === 'undefined' ? '' : DOMPurify.sanitize(html);
};
