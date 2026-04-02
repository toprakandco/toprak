'use server';

import Anthropic from '@anthropic-ai/sdk';

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514';

export async function translateFromTurkish(
  text: string,
  target: 'de' | 'fr',
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error('ANTHROPIC_API_KEY tanımlı değil (.env.local).');
  }
  const trimmed = text.trim();
  if (!trimmed) return '';

  const langName = target === 'de' ? 'German' : 'French';
  const client = new Anthropic({ apiKey: key });
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Translate the following Turkish text to ${langName}. Preserve tone for a creative agency website. Return only the translation, no quotes or explanation.

${trimmed}`,
      },
    ],
  });
  const block = res.content[0];
  return block.type === 'text' ? block.text.trim() : '';
}
