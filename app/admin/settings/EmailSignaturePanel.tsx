'use client';

const SIGNATURES = [
  {
    id: 'ece',
    label: 'Ece',
    file: '/email-signature-ece.html',
    downloadName: 'email-signature-ece.html',
  },
  {
    id: 'eymen',
    label: 'Eymen',
    file: '/email-signature-eymen.html',
    downloadName: 'email-signature-eymen.html',
  },
] as const;

export function EmailSignaturePanel() {
  return (
    <div className="space-y-8 rounded-xl border border-beige bg-white p-6 shadow-sm">
      <div>
        <p className="max-w-2xl font-sans text-sm leading-relaxed text-[#6B4C35]">
          İmzayı Gmail / Outlook’ta kullanmak için HTML dosyasını indirip istemcinizin
          imza ayarlarına yapıştırabilir veya kaynak kodunu kopyalayabilirsiniz. Logo için{' '}
          <code className="rounded bg-[#F5F0E6] px-1.5 py-0.5 text-xs">toprakco.tr/logo.png</code>{' '}
          adresi kullanılır.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {SIGNATURES.map((sig) => (
          <div
            key={sig.id}
            className="flex flex-col overflow-hidden rounded-lg border border-[#EDE4D3] bg-[#FDFCF9]"
          >
            <div className="flex items-center justify-between border-b border-[#EDE4D3] bg-white px-4 py-3">
              <span className="font-sans text-sm font-semibold text-[#3D1F10]">
                {sig.label}
              </span>
              <a
                href={sig.file}
                download={sig.downloadName}
                className="inline-flex min-h-[36px] items-center justify-center rounded-lg border border-[#8B3A1E] bg-white px-3 font-sans text-xs font-medium text-[#8B3A1E] transition hover:bg-[#8B3A1E]/5"
              >
                HTML indir
              </a>
            </div>
            <div className="min-h-[200px] flex-1 p-3">
              <iframe
                title={`E-posta imzası önizleme — ${sig.label}`}
                src={sig.file}
                className="h-[200px] w-full rounded border border-[#EDE4D3] bg-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
