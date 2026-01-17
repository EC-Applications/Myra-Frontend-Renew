"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export function NewApplication() {
  const [formData, setFormData] = useState({
    applicationName: "Bug Reporter",
    developerName: "Bug Reporter Corp",
    developerUrl: "https://bugreporter.com/linear-app",
    description:
      "Allows a user to create Linear issues from within the Bug Reporter application.",
    callbackUrls:
      "https://bugreporter.com/callback\nhttps://bugreporter.com/callback2",
    githubUsername: "github-username",
    isPublic: true,
    refreshTokens: true,
    webhooks: true,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen w-full max-w-3xl mx-auto">
      {/* Main Content */}
      <div className="px-6 py-8">
        <h1 className="text-2xl font-semibold mb-8">Create new application</h1>

        <Card>
          <CardContent>
            <div className="space-y-8">
              {/* Application Icon */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <Camera className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="flex flex-col">
                    <Label className="text-sm font-medium">
                      Application icon
                    </Label>
                    <div className="text-sm text-muted-foreground">
                      At least 256x256px
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="applicationName"
                  className="text-sm font-medium"
                >
                  Application name
                  <span className="text-muted-foreground font-normal ml-2">
                    User visible name for your application
                  </span>
                </Label>
                <Input
                  id="applicationName"
                  value={formData.applicationName}
                  onChange={(e) =>
                    handleInputChange("applicationName", e.target.value)
                  }
                />
              </div>

              {/* Developer Name */}
              <div className="space-y-2">
                <Label htmlFor="developerName" className="text-sm font-medium">
                  Developer name
                  <span className="text-muted-foreground font-normal ml-2">
                    The person or company developing this application
                  </span>
                </Label>
                <Input
                  id="developerName"
                  value={formData.developerName}
                  onChange={(e) =>
                    handleInputChange("developerName", e.target.value)
                  }
                />
              </div>

              {/* Developer URL */}
              <div className="space-y-2">
                <Label htmlFor="developerUrl" className="text-sm font-medium">
                  Developer URL
                  <span className="text-muted-foreground font-normal ml-2">
                    Homepage or documentation for your application
                  </span>
                </Label>
                <Input
                  id="developerUrl"
                  value={formData.developerUrl}
                  onChange={(e) =>
                    handleInputChange("developerUrl", e.target.value)
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                  <span className="text-muted-foreground font-normal ml-2">
                    Describe your application
                  </span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="bg-muted border-gray-700 text-white min-h-[80px]"
                />
              </div>

              {/* Callback URLs */}
              <div className="space-y-2">
                <Label htmlFor="callbackUrls" className="text-sm font-medium">
                  Callback URLs
                  <span className="text-muted-foreground font-normal ml-2">
                    All OAuth redirect URLs, separated with newlines
                  </span>
                </Label>
                <Textarea
                  id="callbackUrls"
                  value={formData.callbackUrls}
                  onChange={(e) =>
                    handleInputChange("callbackUrls", e.target.value)
                  }
                  className="bg-muted border-gray-700 text-white min-h-[80px]"
                />
              </div>

              {/* GitHub Username */}
              <div className="space-y-2">
                <Label htmlFor="githubUsername" className="text-sm font-medium">
                  GitHub username
                  <span className="text-muted-foreground font-normal ml-2">
                    Add a GitHub username to associate commits and comments in
                    GitHub with your application (applies to{" "}
                    <code className="bg-gray-800 px-1 py-0.5 rounded text-xs">
                      actor+app
                    </code>{" "}
                    only)
                  </span>
                </Label>
                <Input
                  id="githubUsername"
                  value={formData.githubUsername}
                  onChange={(e) =>
                    handleInputChange("githubUsername", e.target.value)
                  }
                />
              </div>

              {/* Toggle Options */}
              <div className="space-y-6">
                {/* Public */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Public</div>
                    <div className="text-sm text-muted-foreground">
                      Allow this application to be installed by other workspaces
                    </div>
                  </div>
                  <Switch
                    checked={formData.isPublic}
                    onCheckedChange={(checked) =>
                      handleInputChange("isPublic", checked)
                    }
                  />
                </div>

                {/* Refresh Tokens */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Refresh tokens</div>
                    <div className="text-sm text-muted-foreground">
                      Use refresh tokens with short-lived access tokens during
                      OAuth for added security.{" "}
                      <span className="underline cursor-pointer">Docs</span>
                    </div>
                  </div>
                  <Switch
                    checked={formData.refreshTokens}
                    onCheckedChange={(checked) =>
                      handleInputChange("refreshTokens", checked)
                    }
                  />
                </div>

                {/* Webhooks */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Webhooks</div>
                    <div className="text-sm text-muted-foreground">
                      Webhooks allow you to receive HTTP push notifications on
                      your specified URL.{" "}
                      <span className="underline cursor-pointer">Docs</span>
                    </div>
                  </div>
                  <Switch
                    checked={formData.webhooks}
                    onCheckedChange={(checked) =>
                      handleInputChange("webhooks", checked)
                    }
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6">
                <Link to={"../"}>
                  <Button variant="outline">Cancel</Button>
                </Link>
                <Button>Create</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
