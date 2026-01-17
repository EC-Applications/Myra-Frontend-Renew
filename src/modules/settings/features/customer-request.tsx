"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ChevronRight,
  ExternalLink,
  MoreHorizontal,
  Plus,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function CustomerRequests() {
  const [enableCustomerRequests, setEnableCustomerRequests] = useState(true);
  const [allowManualEdits, setAllowManualEdits] = useState(true);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-foreground">
          Customer requests
        </h1>
        <p className="text-muted-foreground">
          Associate customers with projects and issues to align development
          efforts with real user needs. Manage and track customer requests
          across your entire organization.{" "}
          <a
            href="#"
            className="text-foreground hover:underline inline-flex items-center gap-1"
          >
            Docs <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>

      {/* Enable Customer requests */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">
              Enable Customer requests
            </h3>
            <p className="text-sm text-muted-foreground">
              Workspace-wide access to create and view customer requests
            </p>
          </div>
          <Switch
            checked={enableCustomerRequests}
            onCheckedChange={setEnableCustomerRequests}
          />
        </div>
      </div>

      {/* Manage customers */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-medium text-foreground">Manage customers</h3>
              <p className="text-sm text-muted-foreground">
                Manage your list of customers and their requests
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">1 customer</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Issue routing */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-foreground mb-2">
            Issue routing
          </h2>
          <p className="text-sm text-muted-foreground">
            When a new issue is created from a customer page, it will be routed
            to the default team's triage or backlog. This centralizes customer
            requests for ease of management and prioritization.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">
              Default team for customer requests
            </span>
            <Select defaultValue="mars">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mars">MARS</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Customer statuses */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Customer statuses
          </h2>
          <p className="text-sm text-muted-foreground">
            Define statuses for segmenting customers
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <span className="font-medium text-foreground">
              4 customer statuses
            </span>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-foreground">Active</span>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-foreground">Prospect</span>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-foreground">Churned</span>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-foreground">Lost</span>
              </div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Customer tiers */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Customer tiers
          </h2>
          <p className="text-sm text-muted-foreground">
            Define tiers for segmenting customers
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">No customer tiers</span>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Display options */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-foreground">Display options</h2>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  Revenue formatting
                </h3>
                <p className="text-sm text-muted-foreground">
                  Data imports must be in annual figures, but can be displayed
                  as monthly or annual
                </p>
              </div>
              <Select defaultValue="annual">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">
                  Revenue currency
                </h3>
                <p className="text-sm text-muted-foreground">
                  The currency used when displaying customer revenue
                </p>
              </div>
              <Select defaultValue="usd">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Customer attributes data source */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Customer attributes data source
          </h2>
          <p className="text-sm text-muted-foreground">
            Sync customer attributes from an external data source
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">
              External data source
            </span>
            <span className="text-muted-foreground">None</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-foreground">
                Allow manual edits
              </h3>
              <p className="text-sm text-muted-foreground">
                Attributes can be edited in the Linear UI
              </p>
            </div>
            <Switch
              checked={allowManualEdits}
              onCheckedChange={setAllowManualEdits}
            />
          </div>
        </div>
      </div>

      {/* Excluded domains and emails */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Excluded domains and emails
          </h2>
          <p className="text-sm text-muted-foreground">
            Domains and emails that should never create customer requests
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              No excluded domains and emails
            </span>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Generic domains and emails */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Generic domains and emails
          </h2>
          <p className="text-sm text-muted-foreground">
            Domains and emails that are not associated with a specific customer.
            Common providers like Gmail, Outlook, etc. are already included.{" "}
            <a
              href="#"
              className="text-foreground hover:underline inline-flex items-center gap-1"
            >
              List of generic domains <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              No excluded domains and emails
            </span>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
