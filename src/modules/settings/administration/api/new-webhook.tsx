"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function NewWebhook() {
  const [showSecret, setShowSecret] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["Issues"]);

  const signingSecret = "lin_wh_JVHQ3Fqb78rAedI6qAzcqvItptquq2MZ3CEYA1BJGXHB";

  const dataChangeEvents = [
    "Issue attachments",
    "Comments",
    "Customers",
    "Customer requests",
    "Cycles",
    "Documents",
    "Initiatives",
    "Initiative updates",
    "Issues",
    "Labels",
    "Projects",
    "Project updates",
    "Emoji reactions",
    "Users",
  ];

  const otherEvents = ["Issue SLA"];

  const handleEventChange = (event: string, checked: boolean) => {
    if (checked) {
      setSelectedEvents([...selectedEvents, event]);
    } else {
      setSelectedEvents(selectedEvents.filter((e) => e !== event));
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(signingSecret);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="w-full max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-8">Create webhook</h1>

        <Card>
          <CardContent className="space-y-6">
            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label" className="text-sm font-medium">
                Label
              </Label>
              <Input
                id="label"
                placeholder="A descriptive label"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">
                URL
              </Label>
              <Input
                id="url"
                placeholder="https://..."
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Signing Secret */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium">Signing secret</Label>
                <span className="text-xs text-gray-400">
                  A secret token used to sign the webhook payload.
                </span>
                <Button
                  variant="link"
                  className="text-xs text-blue-400 p-0 h-auto"
                >
                  Docs →
                </Button>
              </div>
              <div className="relative">
                <Input
                  value={
                    showSecret
                      ? signingSecret
                      : "•".repeat(signingSecret.length)
                  }
                  readOnly
                  className="bg-gray-800 border-gray-700 text-white pr-20 font-mono text-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copySecret}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSecret(!showSecret)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    {showSecret ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Data Change Events */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Data change events</Label>
              <div className="grid grid-cols-2 gap-3">
                {dataChangeEvents.map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <Checkbox
                      id={event}
                      checked={selectedEvents.includes(event)}
                      onCheckedChange={(checked) =>
                        handleEventChange(event, checked as boolean)
                      }
                      className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor={event}
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {event}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Events */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Other events</Label>
              <div className="space-y-3">
                {otherEvents.map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <Checkbox
                      id={event}
                      checked={selectedEvents.includes(event)}
                      onCheckedChange={(checked) =>
                        handleEventChange(event, checked as boolean)
                      }
                      className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label
                      htmlFor={event}
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {event}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Team selection</Label>
              <p className="text-xs text-gray-400 mb-2">
                This field cannot be modified after creation
              </p>
              <Select defaultValue="all-public-teams">
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all-public-teams" className="text-white">
                    All public teams
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Create Button */}
            <div className="flex justify-end pt-4">
              <Button>Create webhook</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
