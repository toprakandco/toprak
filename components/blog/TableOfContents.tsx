'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';

export type TocItem = { id: string; text: string; level: 2 | 3 };

type Props = {
  containerId: string;
  contentKey: string;
};

export function TableOfContents({ containerId, contentKey }: Props) {
  const t = useTranslations('blog.detail');
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) {
      setItems([]);
      return;
    }

    const heads = root.querySelectorAll('h2, h3');
    const next: TocItem[] = [];
    heads.forEach((node, i) => {
      const el = node as HTMLElement;
      const level = el.tagName === 'H2' ? 2 : 3;
      const text = el.textContent?.trim() ?? '';
      if (!text) return;
      if (!el.id) {
        let id = `blog-h-${i}`;
        let n = 0;
        while (document.getElementById(id)) {
          n += 1;
          id = `blog-h-${i}-${n}`;
        }
        el.id = id;
      }
      next.push({ id: el.id, text, level });
    });
    setItems(next);
  }, [containerId, contentKey]);

  useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-15% 0px -50% 0px', threshold: [0, 0.2, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const onClick = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden lg:block">
      <nav
        className="sticky top-[calc(var(--navbar-height)+1.5rem)] max-h-[min(70vh,32rem)] overflow-y-auto rounded-xl border border-[#EDE4D3] bg-white p-5"
        aria-label={t('tocTitle')}
      >
        <p className="font-serif text-sm font-semibold text-[#3D1F10]">{t('tocTitle')}</p>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} style={{ paddingLeft: item.level === 3 ? 12 : 0 }}>
                <button
                  type="button"
                  onClick={() => onClick(item.id)}
                    className={`relative w-full text-left transition-colors ${
                    isActive
                      ? 'pl-3 font-medium text-accent'
                      : 'text-[#3D1F10]/65 hover:text-accent'
                  }`}
                >
                  {isActive ? (
                    <span
                      className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent"
                      aria-hidden
                    />
                  ) : null}
                  {item.text}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
