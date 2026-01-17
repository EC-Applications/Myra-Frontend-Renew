"use client";

import { Button } from "@/components/ui/button";

export function Asks() {
  return (
    <div className="w-full max-w-3xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold text-foreground">Asks</h1>
        <p className="text-muted-foreground leading-relaxed">
          Let anyone create bug reports, ideas, and other workplace requests
          using uniform templates via your Slack workspace or a custom email
          address.{" "}
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

      {/* Upgrade Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-2">
            <h2 className="text-lg font-medium text-foreground">
              Upgrade to unlock Asks
            </h2>
            <p className="text-muted-foreground">
              Available on the Business plan. Access Asks, and all other
              Business features, for 30 days with a free trial. For questions,{" "}
              <a href="#" className="text-foreground hover:underline">
                contact our sales team
              </a>
              .
            </p>
          </div>

          
          <Button className="ml-6 shrink-0">Start free trial</Button>
        </div>
      </div>
    </div>
  );
}
