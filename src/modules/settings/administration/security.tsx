import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const Security = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");

  const handleAddDomain = () => {
    console.log("Adding domain:", domain, "with email:", email);
    setIsModalOpen(false);
    setDomain("");
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-8">Security</h1>

        <div className="space-y-8">
          {/* Workspace access */}
          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">Workspace access</h2>

            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Invite links</h3>
                  <p className="text-sm text-muted-foreground">
                    A uniquely generated invite link allows anyone with the link
                    to join your workspace
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">
              Approved email domains
            </h2>
            <p className="text-sm text-muted-foreground mb-4 ms-1">
              Anyone with an email address at these domains is allowed to sign
              up for this workspace.{" "}
              <span className="text-blue-500 hover:text-blue-400 cursor-pointer">
                Docs →
              </span>
            </p>
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    No approved email domains
                  </h3>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                      Add domain
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-md"
                    showCloseButton={false}
                  >
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <DialogTitle className="text-lg font-medium ">
                        Add domain
                      </DialogTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setIsModalOpen(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </DialogHeader>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Domain
                        </label>
                        <Input
                          placeholder="Domain"
                          value={domain}
                          onChange={(e) => setDomain(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email for verification
                        </label>
                        <Input
                          placeholder="Email address for that domain"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button onClick={handleAddDomain}>Add domain</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Workspace restrictions */}
          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">
              Workspace restrictions
            </h2>

            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Restrict new user invitations
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Only allow admins to invite new members to workspace
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  Available on Basic
                </span>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Restrict new team creation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Only allow admins to create new teams
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  Available on Business
                </span>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Restrict workspace label management
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Only allow admins to create, update, and delete workspace
                    labels
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  Available on Business
                </span>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Enable member API keys
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Members of your workspace can create API keys to interact
                    with the Linear API on their behalf
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Restrict file uploads */}
          <div>
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Restrict file uploads
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Only allow specific file types to be uploaded
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  Available on Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* Authentication methods */}
          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">
              Authentication methods
            </h2>
            <p className="text-sm text-muted-foreground mb-4 ms-1">
              Admins can always authenticate via Google and email/passkeys —
              even when disabled for members
            </p>

            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Google authentication
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    When enabled, this is available to all workspace members and
                    guests
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Email & passkey authentication
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    When enabled, this is available to all workspace members and
                    guests
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">SAML & SCIM</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage logins via an identity provider's SSO
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  Available on Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* Integrations & applications */}
          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">
              Integrations & applications
            </h2>

            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Review third-party applications
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Control which applications can be installed to your
                    workspace.{" "}
                    <span className="text-blue-500 hover:text-blue-400 cursor-pointer">
                      Docs →
                    </span>
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  Available on Enterprise
                </span>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Reduce personal information from support integrations
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Personal information from support integrations will not be
                    stored.
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  Available on Enterprise
                </span>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Prevent guests from interacting with agents in the workspace
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Restrict agent invocation to full workspace members only
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  Available on Basic
                </span>
              </div>
            </div>
          </div>

          {/* Data collection */}
          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">Data collection</h2>

            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">
                    Improve AI features by sharing usage data
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Feedback on AI results is used to enhance functionality and
                    will not be used to train models
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

export default Security;
