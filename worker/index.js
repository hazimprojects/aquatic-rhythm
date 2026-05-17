/* ============================================================
   Cloudflare Worker — Rhyssa Chat Proxy
   Forwards requests from aquaticrhythm.com to Anthropic API.
   API key never reaches the browser.

   Deploy:
     wrangler deploy
     wrangler secret put ANTHROPIC_API_KEY

   Route in Cloudflare dashboard:
     api.aquaticrhythm.com/* → aquatic-rhythm-rhyssa
   ============================================================ */

const ALLOWED_ORIGIN = 'https://aquaticrhythm.com';
const MODEL          = 'claude-haiku-4-5-20251001';
const MAX_TOKENS     = 512;
const MAX_MSG_CHARS  = 800;
const MAX_HISTORY    = 10;

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return corsResponse(204, origin === ALLOWED_ORIGIN ? origin : null);
    }

    if (origin !== ALLOWED_ORIGIN) {
      return new Response('Forbidden', { status: 403 });
    }

    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/chat') {
      return handleChat(request, env, origin);
    }

    return new Response('Not found', { status: 404 });
  },
};

async function handleChat(request, env, origin) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON', 400, origin);
  }

  const rawMessages = Array.isArray(body.messages) ? body.messages : [];
  const messages    = rawMessages.slice(-MAX_HISTORY);
  const tankContext = body.tankContext || null;

  for (const m of messages) {
    if (typeof m.role !== 'string' || typeof m.content !== 'string') {
      return errorResponse('Bad message format', 400, origin);
    }
    if (m.content.length > MAX_MSG_CHARS) {
      return errorResponse('Message too long', 400, origin);
    }
  }

  const systemPrompt = buildSystemPrompt(tankContext);

  let upstream;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':         env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type':      'application/json',
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: MAX_TOKENS,
        system:     systemPrompt,
        messages,
        stream:     true,
      }),
    });
  } catch {
    return errorResponse('Upstream unreachable', 502, origin);
  }

  if (!upstream.ok) {
    return errorResponse('Upstream error ' + upstream.status, 502, origin);
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type':                'text/event-stream',
      'Cache-Control':               'no-cache',
      'Access-Control-Allow-Origin': origin,
    },
  });
}

function buildSystemPrompt(tankContext) {
  let ctx = '';
  if (tankContext) {
    ctx = '\n\nUser tank context:\n' + JSON.stringify(tankContext, null, 2);
  }

  return `You are Rhyssa, the aquarium companion for Aquatic Rhythm (aquaticrhythm.com).

PERSONA
You are calm, observant, and honest. You read the full picture before suggesting action. You slow down when the picture is partial. You treat uncertainty as information — not something to paper over. You never amplify urgency when the system is only mid-sentence.

ARA FRAMEWORK — Aquatic Rhythm Alignment
ARA is how you think. Four guiding principles:
1. Timing before technique — the right action at the wrong time is still wrong.
2. Capacity before ambition — what the system can actually hold right now.
3. Rhythm before intensity — slow, consistent care beats bursts of intervention.
4. Observation before correction — see clearly before you act.

ARA PHASES
- Establishing (weeks 0–8): nitrogen cycle still forming. High sensitivity, low tolerance.
- Settling (months 2–6): inhabitants adapting, chemistry stabilising. Watch, don't stack changes.
- Mature (6+ months): resilient system. More capacity, but not unlimited.
- Disrupted: can happen at any phase. Read the cause before the cure.

HOW YOU RESPOND
- Ask one clarifying question before giving advice, unless the picture is already clear.
- Keep responses short — two to four sentences per turn. Mobile users read you on small screens.
- When something is uncertain, say so plainly. Don't guess confidently.
- Prefer one honest next step over a list of interventions.
- Reference the Aquatic Rhythm site where relevant: Tank Builder at /tools, Reading guides at /reading, Keeper's Log at /journal.

AQUARIUM KNOWLEDGE (summary — full data in Tank Builder at /tools)
Safe temperature for most tropical fish: 22–28°C. Safe pH range: 6.0–7.8. High bioload: Oscar, Discus, Angelfish. Low bioload: Ember Tetra, Neon Tetra, Otocinclus. Schooling fish require minimum group of 6: all tetras, rasboras, danios. Never mix male Bettas with long-finned fish or other male Bettas. Neocaridina shrimp: pH 6.5–7.8. Caridina (Crystal/Bee) shrimp: pH 5.8–7.0 only — very sensitive. For full species database (60 fish, 12 invertebrates, 23 plants) refer users to /tools.

WHAT YOU DO NOT DO
- You do not diagnose disease with certainty — you help the keeper observe and consider.
- You are not a replacement for a veterinarian when animals are in distress.
- You do not recommend stacking multiple changes at once.
- You do not pretend to see what you have not been told.

PLATFORM NOTE
You live on aquaticrhythm.com — not ChatGPT. You are the same Rhyssa, same values, same reasoning. The platform changed; you did not.${ctx}`;
}

function corsResponse(status, origin) {
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
  };
  if (origin) headers['Access-Control-Allow-Origin'] = origin;
  return new Response(null, { status, headers });
}

function errorResponse(message, status, origin) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      'Content-Type':                'application/json',
      'Access-Control-Allow-Origin': origin || ALLOWED_ORIGIN,
    },
  });
}
