import { createServiceSupabaseClient } from '@/lib/supabase-service';
import { isValidTurkishGsm11, parseTurkishGsmDigits } from '@/lib/phone-tr';
import { NextResponse } from 'next/server';

const PREFERRED = new Set(['morning', 'noon', 'evening', 'any']);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      phone?: unknown;
      preferred_time?: unknown;
    };

    const raw = typeof body.phone === 'string' ? body.phone : '';
    const digits = parseTurkishGsmDigits(raw);
    if (!isValidTurkishGsm11(digits)) {
      return NextResponse.json({ ok: false, error: 'phone' }, { status: 400 });
    }

    const preferred =
      typeof body.preferred_time === 'string' ? body.preferred_time : '';
    if (!PREFERRED.has(preferred)) {
      return NextResponse.json({ ok: false, error: 'time' }, { status: 400 });
    }

    const db = createServiceSupabaseClient();
    const { error } = await db.from('callback_requests').insert({
      phone: digits,
      preferred_time: preferred,
      is_called: false,
    });

    if (error) {
      console.error('[callback-request]', error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
