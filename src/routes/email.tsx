import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/api/ai.functions";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState<
    "professional" | "friendly" | "persuasive" | "concise" | "apologetic" | "enthusiastic"
  >("professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const onGenerate = async () => {
    if (!purpose.trim() || !audience.trim()) {
      toast.error("Purpose and audience are required");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await generateEmail({ data: { purpose, audience, tone, keyPoints } });
      setOutput(res.content);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="Smart Email Generator"
      description="Draft professional emails tailored to your audience and tone."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email brief</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Request a project status update"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="audience">Audience</Label>
              <Input
                id="audience"
                placeholder="e.g. Senior client stakeholder"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                  <SelectItem value="apologetic">Apologetic</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="kp">Key points (optional)</Label>
              <Textarea
                id="kp"
                placeholder="Anything that must be included"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                className="mt-1.5 min-h-24"
              />
            </div>
            <Button onClick={onGenerate} disabled={loading} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? "Generating…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <AiOutput content={output} loading={loading} emptyHint="Your drafted email will appear here." />
      </div>
    </AppLayout>
  );
}
