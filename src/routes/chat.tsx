import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { chat } from "@/lib/api/ai.functions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Send, Sparkles, User } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await chat({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.content }]);
    } catch (e: any) {
      toast.error(e?.message ?? "Chat failed");
      setMessages(next);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <AppLayout title="AI Chat" description="Brainstorm, refine, plan or summarize — anything.">
      <Card className="flex flex-col h-[calc(100vh-220px)] min-h-[480px] overflow-hidden p-0">
        <div ref={scrollerRef} className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-sm">Ask anything — I’ll keep it concise and actionable.</p>
              <p className="text-xs mt-2">Try: “Draft a 1:1 agenda for a struggling report.”</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2.5 text-sm",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {m.role === "assistant" ? (
                  <div className="markdown-body">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                )}
              </div>
              {m.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-lg bg-muted px-4 py-3 text-sm">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:120ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 bg-card">
          <div className="flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
              className="min-h-[52px] max-h-40 resize-none"
            />
            <Button onClick={send} disabled={loading || !input.trim()} size="lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            AI-generated content may require human review.
          </p>
        </div>
      </Card>
    </AppLayout>
  );
}
