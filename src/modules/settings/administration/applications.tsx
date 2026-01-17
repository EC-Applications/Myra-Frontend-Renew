import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export function Applications() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Applications</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Manage which third-party applications have access to your workspace.
          </span>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-foreground transition-colors"
          >
            Docs
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Empty state */}
      <Card>
        <CardContent>
          <p className="text-sm">
            Your workspace has not yet authorized any external applications to
            connect with your Linear account
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
