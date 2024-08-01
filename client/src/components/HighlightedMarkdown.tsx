import { marked } from 'marked';
import DOMPurify from 'dompurify';

const HighlightedMarkdown = ({ text, wordsToHighlight }: { text: string, wordsToHighlight: string[] }) => {
    // Convert markdown to HTML
    const rawHtml = marked.parse(text);

    // Escape HTML
    let sanitizedHtml = DOMPurify.sanitize(rawHtml as string);

    // Highlight words
    wordsToHighlight.forEach((word) => {
        const regex = new RegExp(`(${word})`, 'gi');
        sanitizedHtml = sanitizedHtml.replace(regex, '<span class="bg-yellow-300">$1</span>');
    });

    return (
        <div
            className=""
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
};

export default HighlightedMarkdown;