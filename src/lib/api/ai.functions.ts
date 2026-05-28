import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-3-flash-preview";

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

async function callAI(messages: ChatMsg[]): Promise<string> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model: DEFAULT_MODEL, messages }),
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("Rate limit exceeded. Please try again in a moment.");
    if (res.status === 402)
      throw new Error("AI credits exhausted. Add funds at Settings → Workspace → Usage.");
    const t = await res.text();
    console.error("AI gateway error:", res.status, t);
    throw new Error("AI service is currently unavailable.");
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ---------- 1. Smart Email Generator ----------
export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      purpose: z.string().min(3),
      audience: z.string().min(1),
      tone: z.enum(["professional", "friendly", "persuasive", "concise", "apologetic", "enthusiastic"]),
      keyPoints: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are an expert business communication assistant. Write polished, ready-to-send emails.
Always return ONLY the email in this exact markdown structure:

**Subject:** <one clear, specific subject line>

---

<greeting>

<body — short paragraphs, no fluff, action-oriented>

<sign-off>

Rules:
- Match the requested tone precisely.
- Adapt vocabulary to the stated audience.
- Keep under 200 words unless complexity demands more.
- Never invent names, dates, or facts not provided. Use placeholders like [Name] when needed.`;

    const user = `Purpose: ${data.purpose}
Audience: ${data.audience}
Tone: ${data.tone}
Key points to include: ${data.keyPoints || "(none specified)"}`;

    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

// ---------- 2. Meeting Notes Summarizer ----------
export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator(z.object({ notes: z.string().min(20) }))
  .handler(async ({ data }) => {
    const system = `You are a precise meeting analyst. Convert raw meeting notes or transcripts into a structured summary.
Return ONLY markdown in this exact format:

## Summary
<2–3 sentence overview>

## Key Points
- <bullet>
- <bullet>

## Decisions Made
- <bullet, or "None recorded">

## Action Items
| Owner | Task | Deadline |
|-------|------|----------|
| <name or TBD> | <task> | <date or TBD> |

## Open Questions
- <bullet, or "None">

Rules:
- Be faithful to the source — do not invent owners, deadlines, or decisions.
- Use "TBD" when information is missing.
- Keep bullets short and action-oriented.`;

    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: `Meeting notes:\n\n${data.notes}` },
    ]);
    return { content };
  });

// ---------- 3. AI Task Planner ----------
export const planTasks = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      tasks: z.string().min(5),
      hoursAvailable: z.number().min(1).max(24).optional(),
      context: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are a productivity coach who prioritizes work using the Eisenhower matrix and realistic time-boxing.
Return ONLY markdown in this exact format:

## Prioritized Plan
| # | Task | Priority | Est. Time | Suggested Slot |
|---|------|----------|-----------|----------------|
| 1 | <task> | P1 / P2 / P3 / P4 | <e.g. 45m> | <e.g. 9:00–9:45> |

## Reasoning
- <one line per top-priority task explaining why it ranks here>

## Focus Tip
<one short, concrete focus or batching recommendation>

Priority key: P1 urgent+important, P2 important not urgent, P3 urgent not important, P4 neither.
Schedule across the available hours starting from 9:00 unless context says otherwise.`;

    const user = `Tasks (one per line or comma separated):
${data.tasks}

Hours available today: ${data.hoursAvailable ?? 8}
Additional context: ${data.context || "(none)"}`;

    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    return { content };
  });

// ---------- 4. AI Research Assistant ----------
export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      topic: z.string().min(3),
      depth: z.enum(["brief", "standard", "deep"]).default("standard"),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are a senior research analyst. Produce structured, insight-led briefings — never marketing fluff.
Return ONLY markdown in this exact format:

# <Topic title>

## TL;DR
<3 sentences max>

## Key Insights
1. **<headline>** — <1–2 sentence explanation>
2. **<headline>** — <...>
3. **<headline>** — <...>

## Context & Background
<one tight paragraph>

## Opportunities / Implications
- <bullet>
- <bullet>

## Open Questions to Investigate Further
- <bullet>

Rules:
- Be specific. Avoid hedging like "it depends".
- If you are uncertain about a fact, flag it with "(verify)".
- Depth = ${data.depth}: brief = ~150 words, standard = ~350 words, deep = ~600 words.`;

    const content = await callAI([
      { role: "system", content: system },
      { role: "user", content: `Topic: ${data.topic}` },
    ]);
    return { content };
  });

// ---------- 5. AI Chatbot ----------
export const chat = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      messages: z.array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        }),
      ),
    }),
  )
  .handler(async ({ data }) => {
    const system = `You are the AI Workplace Productivity Assistant — a focused, professional copilot for knowledge workers.
- Help with writing, planning, summarizing, brainstorming, and decision-making.
- Be concise and actionable. Prefer bullet points and short paragraphs.
- Use markdown for structure (headings, lists, bold).
- If a request is ambiguous, ask one clarifying question before answering.
- Never fabricate facts; flag uncertainty plainly.`;

    const content = await callAI([
      { role: "system", content: system },
      ...data.messages,
    ]);
    return { content };
  });
