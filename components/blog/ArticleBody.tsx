'use client';

import ReactMarkdown from 'react-markdown';

const proseClass =
  'blog-article-prose prose prose-lg max-w-none text-[#3D1F10]';

function looksLikeHtmlFragment(content: string) {
  const t = content.trim();
  return (
    /<\/(p|div|section|article|h[1-6]|span|ul|ol|li|blockquote)\b/i.test(
      content,
    ) || /^\s*<(p|div|section|article|h[1-6]|span|ul|ol)\b/i.test(t)
  );
}

type Props = {
  content: string;
};

export function ArticleBody({ content }: Props) {
  if (looksLikeHtmlFragment(content)) {
    return (
      <div
        id="article-body"
        className={proseClass}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div id="article-body" className={proseClass}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
