import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';

export const alt = 'Toprak & Co.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  let logoDataUrl: string | null = null;
  try {
    const buf = await readFile(
      join(process.cwd(), 'public', 'photos', 'LOGO.png'),
    );
    logoDataUrl = `data:image/png;base64,${buf.toString('base64')}`;
  } catch {
    logoDataUrl = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F5F0E6',
          gap: 28,
        }}
      >
        {logoDataUrl ? (
          <img
            alt=""
            src={logoDataUrl}
            height={120}
            width={320}
            style={{ height: 120, width: 320, objectFit: 'contain' }}
          />
        ) : (
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#3D1F10',
              fontFamily: 'Georgia, "Times New Roman", serif',
            }}
          >
            Toprak & Co.
          </div>
        )}
        <div
          style={{
            fontSize: 30,
            fontWeight: 500,
            color: '#8B3A1E',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            letterSpacing: '0.02em',
          }}
        >
          Kreatif Ajans | toprakco.tr
        </div>
      </div>
    ),
    { ...size },
  );
}
