import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router";

export function RecurringIssues() {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-foreground mb-4">
        Recurring issues
      </h1>

      {/* Description */}
      <p className="text-muted-foreground mb-8 max-w-2xl">
        Automatically create issues that need to completed on a regular
        schedule. Each issue is created with a due set by by the schedule. A new
        instance is created after each due date passes.{" "}
        <a href="#" className="text-blue-500 hover:underline">
          Docs ↗
        </a>
      </p>

      <div>
        <div className="border border-border rounded-lg bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">No recurring issues</span>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-accent rounded transition-colors">
              <Link to="./new">
                <Button variant="ghost" size="sm">
                  <Plus /> New recurring issue
                </Button>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
