import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/api/ai.functions";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Summarizer" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const onRun = async () => {
    if (notes.trim().length < 20) {
      toast.error("Paste meeting notes (at least 20 characters)");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await summarizeMeeting({ data: { notes } });
      setOutput(res.content);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Meeting Notes Summarizer"
      description="Extract key points, decisions, action items and deadlines from raw notes."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Raw notes or transcript</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="notes" className="sr-only">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Paste meeting notes, bullet points, or a transcript here…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[320px]"
              />
            </div>
            <Button onClick={onRun} disabled={loading} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? "Summarizing…" : "Summarize meeting"}
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          content={output}
          loading={loading}
          emptyHint="A structured summary with action items will appear here."
        />
      </div>
    </AppLayout>
  );
}
