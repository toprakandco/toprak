import Link from 'next/link';

type View = 'messages' | 'callbacks';

export function ContactsViewTabs({ view }: { view: View }) {
  const tab = (active: boolean) =>
    `inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
      active
        ? 'border-[#8B3A1E] bg-[#8B3A1E] text-cream'
        : 'border-[#EDE4D3] bg-white text-[#3D1F10] hover:bg-[#F8F7F4]'
    }`;

  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/admin/contacts" className={tab(view === 'messages')}>
        Mesajlar
      </Link>
      <Link href="/admin/contacts?view=callbacks" className={tab(view === 'callbacks')}>
        Geri Arama Talepleri
      </Link>
    </div>
  );
}
