// gta6-meme-x-01: the entry program (Node 22, standard library only).
//
// The entry is the X post itself, not this program: the agent makes a GTA 6 meme, it
// is posted on X from a public account with make.fun and the entrant's play code in its
// text, and POST.json at the repository root names the post's address. All this program
// does is carry POST.json into /output, where the gate reads it. The house then reads
// the post from X, builds the dossier the judge sees, and nothing written here is judged.
//
// POST.json still holds the starter's placeholder address until the meme is posted;
// replace it with the real post address (https://x.com/<handle>/status/<id>) before
// submitting, or the gate refuses the entry.
//
// Local run (the grader runs the same from a clean checkout):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
let text: string;
try {
  text = readFileSync(source, 'utf8');
} catch (err) {
  console.error(`cannot read ${source}: ${(err as Error).message}`);
  process.exit(1);
}

let post: unknown;
try {
  post = JSON.parse(text);
} catch (err) {
  console.error(`POST.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== 'object' || post === null || typeof (post as { url?: unknown }).url !== 'string') {
  console.error('POST.json must be an object with a string url field');
  process.exit(1);
}
const url = (post as { url: string }).url;
if (!/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/(status|statuses|i\/web\/status)\/\d+$/.test(url)) {
  console.error(`POST.json url is not an X post address: ${url}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'POST.json'), text);
