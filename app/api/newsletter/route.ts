import { createSupabaseClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const raw = typeof body.email === 'string' ? body.email.trim() : '';
    const email = raw.toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 });
    }

    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email, is_active: true });

    if (error) {
      // Unique violation — still OK for UX (do not leak existence)
      if (error.code === '23505') {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
