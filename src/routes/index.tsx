import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "AI-powered workplace assistant for emails, meetings, task planning, research and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    desc: "Draft professional emails tuned to your audience and tone.",
  },
  {
    to: "/meetings",
    icon: FileText,
    title: "Meeting Summarizer",
    desc: "Turn raw notes into key points, decisions and action items.",
  },
  {
    to: "/tasks",
    icon: ListChecks,
    title: "AI Task Planner",
    desc: "Prioritize your day with time-boxed, focused schedules.",
  },
  {
    to: "/research",
    icon: Search,
    title: "Research Assistant",
    desc: "Get structured briefings with insights and open questions.",
  },
  {
    to: "/chat",
    icon: MessageSquare,
    title: "AI Chat",
    desc: "Ask anything — brainstorm, refine, plan, or summarize.",
  },
] as const;

function Dashboard() {
  return (
    <AppLayout
      title="Welcome back"
      description="Your AI copilot for everyday knowledge work."
    >
      <section className="rounded-xl border bg-gradient-to-br from-primary/5 via-background to-background p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold">Five focused tools, one workspace.</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Generate emails, summarize meetings, plan your day, research topics, and chat with an
              AI assistant — all in one clean interface.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-all group-hover:border-primary/40 group-hover:shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <CardTitle className="text-base mt-3">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-xs font-medium text-primary">Open tool →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-xs text-muted-foreground text-center">
        AI-generated content may require human review.
      </p>
    </AppLayout>
  );
}
