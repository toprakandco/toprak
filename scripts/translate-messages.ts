/**
 * Reads messages/en.json and writes messages/de.json + messages/fr.json via Anthropic.
 * Loads .env.local then .env for ANTHROPIC_API_KEY.
 *
 * Optional: ANTHROPIC_MODEL (default claude-sonnet-4-20250514)
 */

import { config as loadEnv } from 'dotenv';
import * as path from 'path';

loadEnv({ path: path.join(process.cwd(), '.env.local') });
loadEnv({ path: path.join(process.cwd(), '.env') });

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';

const MODEL =
  process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function translateString(
  text: string,
  langName: string,
): Promise<string> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `You are a professional translator specializing in creative agency and marketing content.

Translate this text to ${langName}.
Keep the same tone: warm, professional, creative.
Keep any special characters, HTML tags, placeholders, or variables like {name}, {{count}}, and ICU patterns exactly as they are.
Do not translate URL slugs (segments like "grafik-tasarim") if they appear as standalone tokens.
Return ONLY the translated text, nothing else.

Text to translate:
${JSON.stringify(text)}`,
      },
    ],
  });

  const block = response.content[0];
  if (block.type === 'text') {
    let out = block.text.trim();
    if (
      (out.startsWith('"') && out.endsWith('"')) ||
      (out.startsWith("'") && out.endsWith("'"))
    ) {
      try {
        out = JSON.parse(out) as string;
      } catch {
        /* keep trimmed */
      }
    }
    return out;
  }
  return text;
}

async function translateNode(
  key: string,
  value: unknown,
  targetLang: string,
  langName: string,
): Promise<unknown> {
  if (key === 'slug' && typeof value === 'string') {
    return value;
  }

  if (typeof value === 'string') {
    const translated = await translateString(value, langName);
    console.log(`✓ ${key}: ${translated.slice(0, 60)}${translated.length > 60 ? '…' : ''}`);
    await new Promise((r) => setTimeout(r, 200));
    return translated;
  }

  if (Array.isArray(value)) {
    const out: unknown[] = [];
    for (let i = 0; i < value.length; i++) {
      out.push(
        await translateNode(`${key}[${i}]`, value[i], targetLang, langName),
      );
    }
    return out;
  }

  if (value !== null && typeof value === 'object') {
    return translateMessages(
      value as Record<string, unknown>,
      targetLang,
      langName,
    );
  }

  return value;
}

async function translateMessages(
  messages: Record<string, unknown>,
  targetLang: string,
  langName: string,
): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(messages)) {
    result[key] = await translateNode(key, value, targetLang, langName);
  }

  return result;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY. Add it to .env.local and run:');
    console.error('  export $(grep -v "^#" .env.local | xargs) && npx tsx scripts/translate-messages.ts');
    process.exit(1);
  }

  const enPath = path.join(process.cwd(), 'messages/en.json');
  const raw = fs.readFileSync(enPath, 'utf-8');
  const enMessages = JSON.parse(raw) as Record<string, unknown>;

  console.log(`Using model: ${MODEL}\n`);

  console.log('🇩🇪 Translating to German...');
  const deMessages = await translateMessages(enMessages, 'de', 'German');
  fs.writeFileSync(
    path.join(process.cwd(), 'messages/de.json'),
    JSON.stringify(deMessages, null, 2),
    'utf-8',
  );
  console.log('✅ German translation complete!\n');

  console.log('🇫🇷 Translating to French...');
  const frMessages = await translateMessages(enMessages, 'fr', 'French');
  fs.writeFileSync(
    path.join(process.cwd(), 'messages/fr.json'),
    JSON.stringify(frMessages, null, 2),
    'utf-8',
  );
  console.log('✅ French translation complete!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
