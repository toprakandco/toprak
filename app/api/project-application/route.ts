import { createServiceSupabaseClient } from '@/lib/supabase-service';
import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BUDGETS = new Set([
  'lt-5k',
  '5-15k',
  '15-30k',
  '30k-plus',
  'prefer-not',
]);

const TIMELINES = new Set([
  'urgent-1-3',
  '1-2-weeks',
  '1-month',
  'flexible',
]);

const CONTACT_PREFS = new Set(['email', 'whatsapp', 'video', 'any']);

const SERVICE_IDS = new Set([
  'grafik-tasarim',
  'ceviri',
  'seslendirme',
  'icerik-uretimi',
  'fotograf-video',
  'web-yazilim',
]);

type Body = {
  services?: unknown;
  budget?: unknown;
  timeline?: unknown;
  description?: unknown;
  reference_url?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  contact_preference?: unknown;
  kvkk?: unknown;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    const servicesRaw = body.services;
    if (!Array.isArray(servicesRaw) || servicesRaw.length === 0) {
      return NextResponse.json({ ok: false, error: 'services' }, { status: 400 });
    }
    const services = servicesRaw.filter(
      (s): s is string => typeof s === 'string' && SERVICE_IDS.has(s),
    );
    if (services.length === 0) {
      return NextResponse.json({ ok: false, error: 'services' }, { status: 400 });
    }

    const budget = typeof body.budget === 'string' ? body.budget : '';
    const timeline = typeof body.timeline === 'string' ? body.timeline : '';
    if (!BUDGETS.has(budget) || !TIMELINES.has(timeline)) {
      return NextResponse.json({ ok: false, error: 'budget_timeline' }, { status: 400 });
    }

    const description =
      typeof body.description === 'string' ? body.description.trim() : '';
    if (description.length < 1 || description.length > 800) {
      return NextResponse.json({ ok: false, error: 'description' }, { status: 400 });
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!name || !email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'contact' }, { status: 400 });
    }

    const phone =
      typeof body.phone === 'string' && body.phone.trim()
        ? body.phone.trim()
        : null;
    const company =
      typeof body.company === 'string' && body.company.trim()
        ? body.company.trim()
        : null;

    const contact_preference =
      typeof body.contact_preference === 'string' ? body.contact_preference : '';
    if (!CONTACT_PREFS.has(contact_preference)) {
      return NextResponse.json({ ok: false, error: 'preference' }, { status: 400 });
    }

    if (body.kvkk !== true) {
      return NextResponse.json({ ok: false, error: 'kvkk' }, { status: 400 });
    }

    let reference_url: string | null = null;
    if (typeof body.reference_url === 'string' && body.reference_url.trim()) {
      const u = body.reference_url.trim();
      try {
        const parsed = new URL(u);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          reference_url = u;
        } else {
          return NextResponse.json({ ok: false, error: 'url' }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ ok: false, error: 'url' }, { status: 400 });
      }
    }

    const db = createServiceSupabaseClient();
    const { error } = await db.from('project_applications').insert({
      services,
      budget,
      timeline,
      description,
      reference_url,
      name,
      email,
      phone,
      company,
      contact_preference,
      is_read: false,
    });

    if (error) {
      console.error('[project-application]', error);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
