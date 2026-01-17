"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Hash,
  Mail,
  Monitor,
  Slack,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function Notifications() {
  const [showUpdatesInSidebar, setShowUpdatesInSidebar] = useState(true);
  const [changelogNewsletter, setChangelogNewsletter] = useState(true);
  const [marketingAndOnboarding, setMarketingAndOnboarding] = useState(true);
  const [inviteAccepted, setInviteAccepted] = useState(true);
  const [privacyAndLegal, setPrivacyAndLegal] = useState(true);
  const [dataProcessingAgreement, setDataProcessingAgreement] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-3xl mx-auto p-8">
        <div className="space-y-8">
          <h1 className="text-2xl font-semibold">Notifications</h1>

          {/* Notification channels */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-2">
                Notification channels
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Choose how to be notified for workspace activity. Notifications
                will always go to your MyRa inbox.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              <Link
                className="flex items-center justify-between p-4 hover:bg-muted/50"
                to="./desktop"
              >
                <div className="flex items-center gap-3">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Desktop</div>
                    <div className="text-xs text-muted-foreground">
                      • Disabled
                    </div>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
              </Link>

              <Link
                className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                to={"./mobile"}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Mobile</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-500">•</span> Enabled for all
                      notifications
                    </div>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
              </Link>

              <Link
                className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                to={"./email"}
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-xs text-muted-foreground">
                      <span className="text-green-500">•</span> Enabled for all
                      notifications
                    </div>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
              </Link>

              <Link
                className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                to={"./slack"}
              >
                <div className="flex items-center gap-3">
                  <Slack className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Slack</div>
                    <div className="text-xs text-muted-foreground">
                      • Disabled
                    </div>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
              </Link>
            </div>
          </div>

          {/* Updates from MyRa */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Updates from MyRa</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to product announcements and important changes from
                the MyRa team
              </p>
            </div>

            <div>
              <h3 className="text-base font-medium mb-4">Changelog</h3>
              <div className="bg-card border border-border rounded-lg divide-y divide-border">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium">Show updates in sidebar</div>
                    <div className="text-xs text-muted-foreground">
                      Highlight new features and improvements in the app sidebar
                    </div>
                  </div>
                  <Switch
                    checked={showUpdatesInSidebar}
                    onCheckedChange={setShowUpdatesInSidebar}
                  />
                </div>

                <div className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium">Changelog newsletter</div>
                    <div className="text-xs text-muted-foreground">
                      Twice a month email highlighting new features and
                      improvements
                    </div>
                  </div>
                  <Switch
                    checked={changelogNewsletter}
                    onCheckedChange={setChangelogNewsletter}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Marketing */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Marketing</h2>
            <div className="bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">Marketing and onboarding</div>
                  <div className="text-xs text-muted-foreground">
                    Occasional emails to help you get the most out of MyRa
                  </div>
                </div>
                <Switch
                  checked={marketingAndOnboarding}
                  onCheckedChange={setMarketingAndOnboarding}
                />
              </div>
            </div>
          </div>

          {/* Other updates */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Other updates</h2>
            <div className="bg-card border border-border rounded-lg divide-y divide-border">
              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">Invite accepted</div>
                  <div className="text-xs text-muted-foreground">
                    Email when invitees accept an invite
                  </div>
                </div>
                <Switch
                  checked={inviteAccepted}
                  onCheckedChange={setInviteAccepted}
                />
              </div>

              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">Privacy and legal updates</div>
                  <div className="text-xs text-muted-foreground">
                    Email when privacy policies or terms of service change
                  </div>
                </div>
                <Switch
                  checked={privacyAndLegal}
                  onCheckedChange={setPrivacyAndLegal}
                />
              </div>

              <div className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">
                    Data processing agreement (DPA)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Email when our DPA changes
                  </div>
                </div>
                <Switch
                  checked={dataProcessingAgreement}
                  onCheckedChange={setDataProcessingAgreement}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
