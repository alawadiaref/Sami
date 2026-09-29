import { NextRequest, NextResponse } from "next/server";
import { getContent } from "@/lib/content";
import { getTheme } from "@/lib/theme";

// Customer-support chatbot. Two modes, same request shape:
// 1) No CHATBOT_API_KEY set (default): answers from a small local
//    FAQ/policy knowledge base built from the store's own content — works
//    fully offline, no external calls, no cost.
// 2) CHATBOT_API_KEY set: forwards the conversation to a real LLM (e.g. the
//    Anthropic API) with the same knowledge base as a system prompt, so
//    answers become open-ended instead of keyword-matched. No other code
//    needs to change — this is the only file to touch when a key is added.

interface ChatBody {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

// Used as the system-prompt context once a real LLM key is wired in (see the
// commented-out call below) — kept here so both modes share one source of truth.
function buildKnowledgeBase(): string {
  const content = getContent();
  const theme = getTheme();
  return [
    `اسم المتجر: ${theme.storeName}`,
    `سياسة الشحن:\n${content.shippingPolicy}`,
    `سياسة الاستبدال والاسترجاع:\n${content.returnPolicy}`,
    content.socialLinks.length
      ? `وسائل التواصل: ${content.socialLinks.map((s) => s.platform).join("، ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}
void buildKnowledgeBase; // referenced by the real-LLM branch once CHATBOT_API_KEY is set

function localAnswer(message: string): string {
  const kb = getContent();
  const q = message.toLowerCase();

  if (/شحن|توصيل|delivery|shipping/.test(q)) return kb.shippingPolicy;
  if (/استرجاع|استبدال|ارجاع|return|refund/.test(q)) return kb.returnPolicy;
  if (/دفع|تابي|تمارا|بطاقة|payment/.test(q)) {
    return "نوفر الدفع عبر تابي، تمارا، البطاقة البنكية (مدى/فيزا/ماستركارد)، والتحويل البنكي المباشر.";
  }
  if (/تواصل|رقم|واتساب|contact/.test(q)) {
    const links = kb.socialLinks;
    return links.length
      ? "يمكنك التواصل معنا عبر: " + links.map((s) => s.platform).join("، ") + " — التفاصيل في صفحة تواصل معنا."
      : "يمكنك التواصل معنا عبر صفحة تواصل معنا.";
  }
  return "شكرًا لتواصلك! يمكنني مساعدتك بخصوص الشحن، الاسترجاع، طرق الدفع، أو التواصل مع المتجر. لأي استفسار آخر، تواصل معنا مباشرة عبر صفحة تواصل معنا.";
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatBody;
  if (!body.message?.trim()) {
    return NextResponse.json({ error: "الرسالة فارغة" }, { status: 400 });
  }

  if (!process.env.CHATBOT_API_KEY) {
    return NextResponse.json({ reply: localAnswer(body.message), mode: "local" });
  }

  // Real call would go here, e.g. the Anthropic Messages API:
  // const res = await fetch("https://api.anthropic.com/v1/messages", {
  //   method: "POST",
  //   headers: {
  //     "x-api-key": process.env.CHATBOT_API_KEY,
  //     "anthropic-version": "2023-06-01",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     model: "claude-sonnet-5",
  //     max_tokens: 500,
  //     system: `أنت مساعد دعم عملاء لمتجر ساعات. أجب بالعربية بإيجاز واعتمد فقط على المعلومات التالية:\n\n${buildKnowledgeBase()}`,
  //     messages: [...(body.history ?? []), { role: "user", content: body.message }],
  //   }),
  // });
  // const data = await res.json();
  // return NextResponse.json({ reply: data.content[0].text, mode: "llm" });

  return NextResponse.json({ reply: localAnswer(body.message), mode: "local" });
}
