'use client';

import { useCallback, useMemo, useState } from 'react';

type SigFields = {
  name: string;
  title: string;
  email: string;
  phone: string;
};

const PRESETS: [SigFields, SigFields] = [
  {
    name: 'Ece',
    title: 'Kreatif Direktör',
    email: 'ece@toprakco.tr',
    phone: '',
  },
  {
    name: 'Eymen',
    title: 'Kurucu Ortak',
    email: 'eymen@toprakco.tr',
    phone: '',
  },
];

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** İmza parçası — yalnızca inline stiller (e-posta istemcileri). */
export function buildSignatureTableHtml(f: SigFields): string {
  const name = escapeHtml(f.name.trim() || ' ');
  const title = escapeHtml(f.title.trim() || ' ');
  const emailPlain = f.email.trim();
  const email = escapeHtml(emailPlain || ' ');
  const mailtoHref = emailPlain
    ? `mailto:${encodeURIComponent(emailPlain)}`
    : 'mailto:';

  const phoneRaw = f.phone.trim();
  const phoneBlock = phoneRaw
    ? `<p style="margin:4px 0 0;font-size:12px;color:#7A6050;">📱 ${escapeHtml(phoneRaw)}</p>`
    : '';

  return `<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6B4C35;border-collapse:collapse;max-width:440px;">
  <tr>
    <td style="padding-right:16px;border-right:2px solid #8B3A1E;vertical-align:middle;width:1%;">
      <img src="https://toprakco.tr/logo.png" width="110" alt="Toprak &amp; Co." style="display:block;border:0;max-width:110px;height:auto;" />
    </td>
    <td style="padding-left:16px;vertical-align:middle;">
      <p style="margin:0;font-weight:bold;font-size:14px;color:#8B3A1E;line-height:1.3;">${name}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#8B3A1E;line-height:1.35;">${title} — Toprak &amp; Co.</p>
      <p style="margin:10px 0 0;padding-top:8px;border-top:1px solid #EDE4D3;font-size:12px;color:#7A6050;line-height:1.45;">
        📧 <a href="${mailtoHref}" style="color:#7A6050;text-decoration:none;">${email}</a>
      </p>
      <p style="margin:4px 0 0;font-size:12px;color:#7A6050;line-height:1.45;">
        🌐 <a href="https://toprakco.tr" target="_blank" rel="noopener noreferrer" style="color:#7A6050;text-decoration:none;">toprakco.tr</a>
      </p>
      ${phoneBlock}
      <p style="margin:8px 0 0;font-size:11px;color:#7A9E6E;line-height:1.4;">
        Instagram: @toprakco.tr · X: @toprakcotr
      </p>
    </td>
  </tr>
</table>`;
}

function wrapFullDocument(tableHtml: string): string {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Toprak &amp; Co. — E-posta imzası</title>
</head>
<body style="margin:0;padding:16px;background:#ffffff;">
${tableHtml}
</body>
</html>`;
}

type CardProps = {
  label: string;
  fileSlug: string;
  fields: SigFields;
  onChange: (patch: Partial<SigFields>) => void;
  onCopyToast: (msg: string) => void;
};

function SignatureCard({ label, fileSlug, fields, onChange, onCopyToast }: CardProps) {
  const tableHtml = useMemo(() => buildSignatureTableHtml(fields), [fields]);
  const previewDoc = useMemo(() => wrapFullDocument(tableHtml), [tableHtml]);

  const copyHtml = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(tableHtml);
      onCopyToast(
        "İmza kopyalandı! Gmail'de Settings → Signature → HTML modda yapıştırın.",
      );
    } catch {
      onCopyToast('Panoya kopyalanamadı; tarayıcı iznini kontrol edin.');
    }
  }, [onCopyToast, tableHtml]);

  const downloadHtml = useCallback(() => {
    const blob = new Blob([wrapFullDocument(tableHtml)], {
      type: 'text/html;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-signature-${fileSlug}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [fileSlug, tableHtml]);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-[#EDE4D3] bg-[#FDFCF9] shadow-sm">
      <div className="border-b border-[#EDE4D3] bg-white px-4 py-3">
        <h3 className="font-sans text-sm font-semibold text-[#3D1F10]">{label}</h3>
      </div>

      <div className="border-b border-[#EDE4D3] bg-white p-4">
        <p className="mb-2 font-sans text-[11px] font-medium uppercase tracking-wide text-[#6B4C35]">
          Önizleme
        </p>
        <iframe
          title={`E-posta imzası — ${label}`}
          srcDoc={previewDoc}
          className="h-[220px] w-full rounded border border-[#EDE4D3] bg-white"
        />
      </div>

      <div className="space-y-3 p-4">
        <label className="block space-y-1">
          <span className="font-sans text-xs text-[#6B4C35]">İsim</span>
          <input
            value={fields.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="h-10 w-full rounded-lg border border-[#EDE4D3] px-3 font-sans text-sm text-[#3D1F10] outline-none focus:border-[#8B3A1E]"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-xs text-[#6B4C35]">Unvan</span>
          <input
            value={fields.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="örn. Kreatif Direktör"
            className="h-10 w-full rounded-lg border border-[#EDE4D3] px-3 font-sans text-sm text-[#3D1F10] outline-none focus:border-[#8B3A1E]"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-xs text-[#6B4C35]">E-posta</span>
          <input
            type="email"
            value={fields.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="h-10 w-full rounded-lg border border-[#EDE4D3] px-3 font-sans text-sm text-[#3D1F10] outline-none focus:border-[#8B3A1E]"
          />
        </label>
        <label className="block space-y-1">
          <span className="font-sans text-xs text-[#6B4C35]">Telefon (isteğe bağlı)</span>
          <input
            value={fields.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+90 …"
            className="h-10 w-full rounded-lg border border-[#EDE4D3] px-3 font-sans text-sm text-[#3D1F10] outline-none focus:border-[#8B3A1E]"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-[#EDE4D3] bg-white p-4">
        <button
          type="button"
          onClick={copyHtml}
          className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-lg bg-[#8B3A1E] px-4 font-sans text-xs font-medium text-cream transition hover:bg-[#6B2C14]"
        >
          HTML Kopyala
        </button>
        <button
          type="button"
          onClick={downloadHtml}
          className="inline-flex min-h-[40px] flex-1 items-center justify-center rounded-lg border border-[#8B3A1E] bg-white px-4 font-sans text-xs font-medium text-[#8B3A1E] transition hover:bg-[#8B3A1E]/5"
        >
          HTML İndir
        </button>
      </div>
    </div>
  );
}

export function EmailSignatureGenerator() {
  const [ece, setEce] = useState<SigFields>(PRESETS[0]);
  const [eymen, setEymen] = useState<SigFields>(PRESETS[1]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 5000);
  }, []);

  return (
    <div className="space-y-6 rounded-xl border border-beige bg-white p-6 shadow-sm">
      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[100] max-w-[min(100vw-2rem,28rem)] -translate-x-1/2 rounded-xl border border-[#7A9E6E]/40 bg-[#EAF3DE] px-4 py-3 text-center font-sans text-sm font-medium leading-snug text-[#3D1F10] shadow-lg"
        >
          {toast}
        </div>
      ) : null}

      <div>
        <h2 className="font-serif text-xl text-[#3D1F10]">E-posta imzası oluşturucu</h2>
        <p className="mt-2 max-w-3xl font-sans text-sm leading-relaxed text-[#6B4C35]">
          Alanları düzenleyin; önizleme anında güncellenir. Kopyaladığınız HTML, Gmail ve
          benzeri istemcilerde yalnızca tablo yapısı ve inline stiller içerir. Logo:{' '}
          <code className="rounded bg-[#F5F0E6] px-1.5 py-0.5 text-xs">https://toprakco.tr/logo.png</code>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <SignatureCard
          label="Ece"
          fileSlug="ece"
          fields={ece}
          onChange={(patch) => setEce((s) => ({ ...s, ...patch }))}
          onCopyToast={showToast}
        />
        <SignatureCard
          label="Eymen"
          fileSlug="eymen"
          fields={eymen}
          onChange={(patch) => setEymen((s) => ({ ...s, ...patch }))}
          onCopyToast={showToast}
        />
      </div>
    </div>
  );
}
