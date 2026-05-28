import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { researchTopic } from "@/lib/api/ai.functions";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState<"brief" | "standard" | "deep">("standard");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const onRun = async () => {
    if (topic.trim().length < 3) {
      toast.error("Enter a topic");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await researchTopic({ data: { topic, depth } });
      setOutput(res.content);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="AI Research Assistant"
      description="Structured briefings with insights, context and open questions."
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Research a topic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_180px_140px]">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g. Trends in AI-assisted customer support 2025"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Depth</Label>
              <Select value={depth} onValueChange={(v: any) => setDepth(v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deep">Deep</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={onRun} disabled={loading} className="w-full">
                <Sparkles className="h-4 w-4 mr-2" />
                {loading ? "Researching…" : "Run"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AiOutput
        content={output}
        loading={loading}
        emptyHint="A structured briefing will appear here."
      />
    </AppLayout>
  );
}
