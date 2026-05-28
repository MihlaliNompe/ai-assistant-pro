import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { AiOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planTasks } from "@/lib/api/ai.functions";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner" }] }),
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("8");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");

  const onRun = async () => {
    if (tasks.trim().length < 5) {
      toast.error("Add at least one task");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await planTasks({
        data: {
          tasks,
          hoursAvailable: Math.max(1, Math.min(24, Number(hours) || 8)),
          context,
        },
      });
      setOutput(res.content);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to plan tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout
      title="AI Task Planner"
      description="Prioritize and time-box your day with the Eisenhower matrix."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tasks">Tasks (one per line)</Label>
              <Textarea
                id="tasks"
                placeholder={"Finish Q3 report\nReply to client thread\nReview pull request"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                className="mt-1.5 min-h-40"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="hours">Hours available</Label>
                <Input
                  id="hours"
                  type="number"
                  min={1}
                  max={24}
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="ctx">Context (optional)</Label>
              <Textarea
                id="ctx"
                placeholder="e.g. Two meetings between 11–13. Energy peaks in the morning."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="mt-1.5 min-h-20"
              />
            </div>
            <Button onClick={onRun} disabled={loading} className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              {loading ? "Planning…" : "Generate plan"}
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          content={output}
          loading={loading}
          emptyHint="A prioritized, time-boxed plan will appear here."
        />
      </div>
    </AppLayout>
  );
}
