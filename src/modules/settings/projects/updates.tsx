import { Button } from "@/components/ui/button";

export function Updates() {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Project updates
        </h1>
        <p className="text-muted-foreground">
          Short status reports about the progress and health of your projects.
          Project members regularly post updates, and subscribers automatically
          receive them in their inbox.{" "}
          <a
            href="#"
            className="text-foreground hover:underline inline-flex items-center gap-1"
          >
            Docs
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </p>
      </div>

      {/* Update schedule */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">
            Update schedule
          </h2>
          <p className="text-muted-foreground">
            Configure how often updates are expected on projects. Project leads
            will receive reminders to post updates.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <span className="text-foreground">No expectation for updates</span>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        </div>
      </div>

      {/* Slack notifications */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">
            Slack notifications
          </h2>
          <p className="text-muted-foreground">
            Updates are only posted to Slack when associated with at least one
            non-private team
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#4A154B] rounded flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523c0-1.393 1.127-2.52 2.52-2.52h2.52v2.52c0 1.396-1.127 2.523-2.52 2.523zm0-6.73c-1.393 0-2.52-1.127-2.52-2.52s1.127-2.52 2.52-2.52 2.52 1.127 2.52 2.52v2.52H5.042zm6.73 0a2.528 2.528 0 0 1-2.523-2.52c0-1.393 1.127-2.52 2.523-2.52s2.52 1.127 2.52 2.52v2.52h-2.52zm0 6.73c1.396 0 2.52 1.127 2.52 2.52s-1.124 2.523-2.52 2.523-2.523-1.127-2.523-2.523v-2.52h2.523zm6.73 0a2.528 2.528 0 0 1 2.52-2.52c1.393 0 2.52 1.127 2.52 2.52s-1.127 2.523-2.52 2.523h-2.52v-2.523zm0-6.73c0-1.393 1.127-2.52 2.52-2.52s2.52 1.127 2.52 2.52-1.127 2.52-2.52 2.52h-2.52V8.435z" />
              </svg>
            </div>
            <div>
              <div className="text-foreground font-medium">
                Send project updates to a Slack channel
              </div>
              <div className="text-muted-foreground text-sm">
                Connect a channel to send all project updates to
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <svg
              className="w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <Button variant="secondary" size="sm" className="gap-1">
              Connect
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
