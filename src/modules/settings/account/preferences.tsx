import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const Preferences = () => {
  return (
    <div className="min-h-screen">
      <div className="w-full max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-8">Preferences</h1>

        {/* General Section */}
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">General</h2>
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Default home view
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Which view is opened when you open up MyRa
                  </p>
                </div>
                <Select defaultValue="active-issues">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active-issues">Active issues</SelectItem>
                    <SelectItem value="all-issues">All issues</SelectItem>
                    <SelectItem value="my-issues">My issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Display full names
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Show full names of users instead of shorter usernames
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    First day of the week
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Used for date pickers
                  </p>
                </div>
                <Select defaultValue="sunday">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Convert text emoticons into emojis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Strings like :) will be converted to 😊
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          {/* Interface and theme Section */}
          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">
              Interface and theme
            </h2>
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">App sidebar</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize sidebar item visibility, ordering, and badge style
                  </p>
                </div>
                <Button variant="outline">Customize</Button>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Font size</h3>
                  <p className="text-sm text-muted-foreground">
                    Adjust the size of text across the app
                  </p>
                </div>
                <Select defaultValue="default">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Use pointer cursors</h3>
                  <p className="text-sm text-muted-foreground">
                    Change the cursor to a pointer when hovering over any
                    interactive elements
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Interface theme</h3>
                  <p className="text-sm text-muted-foreground">
                    Select or customize your interface color scheme
                  </p>
                </div>
                <Select defaultValue="system">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">🖥️ System preference</SelectItem>
                    <SelectItem value="light">☀️ Light</SelectItem>
                    <SelectItem value="dark">🌙 Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Light</h3>
                  <p className="text-sm text-muted-foreground">
                    Theme to use for light system appearance
                  </p>
                </div>
                <Select defaultValue="light">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">☀️ Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark</h3>
                  <p className="text-sm text-muted-foreground">
                    Theme to use for dark system appearance
                  </p>
                </div>
                <Select defaultValue="dark">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">🌙 Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Desktop application Section */}
          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">
              Desktop application
            </h2>
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Open in desktop app</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically open links in desktop app when possible
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">App notification badge</h3>
                  <p className="text-sm text-muted-foreground">
                    Show a badge on MyRa's icon to indicate unread
                    notifications
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Check spelling</h3>
                  <p className="text-sm text-muted-foreground">
                    Check for spelling errors while typing
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <Separator />

          {/* Automations and workflows Section */}
          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">
              Automations and workflows
            </h2>
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-assign to self</h3>
                  <p className="text-sm text-muted-foreground">
                    When creating new issues, always assign them to yourself by
                    default
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Git attachment format</h3>
                  <p className="text-sm text-muted-foreground">
                    The format of GitHub/GitLab attachments on issues
                  </p>
                </div>
                <Select defaultValue="title">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    On git branch copy, move issue to started status
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    After copying the git branch name, issue status is moved to
                    the team's first started workflow status. Hold Alt to
                    disable.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    On move to started status, assign to yourself
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    When you move an unassigned issue to started, it will be
                    automatically assigned to you.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
