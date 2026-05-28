import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Info } from "lucide-react";
import { toast } from "sonner";

interface AiOutputProps {
  content: string;
  loading?: boolean;
  emptyHint?: string;
}

export function AiOutput({ content, loading, emptyHint }: AiOutputProps) {
  if (loading) {
    return (
      <Card>
        <CardContent className="py-10 space-y-3">
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
          <p className="pt-4 text-xs text-muted-foreground">Generating…</p>
        </CardContent>
      </Card>
    );
  }

  if (!content) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {emptyHint ?? "Your AI-generated result will appear here."}
        </CardContent>
      </Card>
    );
  }

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            AI-generated content may require human review.
          </div>
          <Button variant="ghost" size="sm" onClick={copy}>
            <Copy className="h-4 w-4 mr-1" /> Copy
          </Button>
        </div>
        <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-table:text-sm">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </CardContent>
    </Card>
  );
}
