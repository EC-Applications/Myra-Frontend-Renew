import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function BillingPlans() {
  return (
    <div className="w-full mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold ">Plans</h1>
        <p className="text-muted-foreground">
          You are on the <span className="">Free plan</span>. If you have any
          questions or would like further support with your plan,{" "}
          <a href="#" className=" underline hover:no-underline">
            contact us →
          </a>
        </p>
      </div>

      <Card className="overflow-hidden py-0">
        <CardContent className="px-0">
          {/* Plans Header */}
          <div className="grid grid-cols-5 border-b">
            <div className="p-6"></div>
            <div className="p-6 text-center border-l">
              <h3 className="text-lg font-medium mb-2">Free</h3>
              <div className="text-2xl font-bold mb-1">$0</div>
              <div className="text-sm text-muted-foreground mb-4">
                per user/mo
              </div>
              <Badge variant="secondary" className="text-xs">
                Current plan
              </Badge>
            </div>
            <div className="p-6 text-center border-l">
              <h3 className="text-lg font-medium mb-2">Basic</h3>
              <div className="text-2xl font-bold mb-1">$8</div>
              <div className="text-sm text-muted-foreground mb-4">
                per user/mo billed annually
              </div>
              <Button className=" mb-2">Upgrade</Button>
              <div className="flex justify-center gap-1 text-xs">
                <button className="px-2 py-1 bg-muted rounded">Monthly</button>
                <button className="px-2 py-1 text-muted-foreground">
                  Annually
                </button>
              </div>
            </div>
            <div className="p-6 text-center border-l">
              <h3 className="text-lg font-medium mb-2">Business</h3>
              <div className="text-2xl font-bold mb-1">$14</div>
              <div className="text-sm text-muted-foreground mb-4">
                per user/mo billed annually
              </div>
              <Button className="mb-2">Upgrade</Button>
              <div className="text-xs text-blue-400 underline cursor-pointer">
                Start a free trial
              </div>
            </div>
            <div className="p-6 text-center border-l">
              <h3 className="text-lg font-medium mb-2">Enterprise</h3>
              <div className="text-sm text-muted-foreground mb-4">
                Custom pricing are available
              </div>
              <Button variant="outline">Request</Button>
            </div>
          </div>

          {/* Usage Section */}
          <div className="border-b">
            <div className="grid grid-cols-5 py-4">
              <div className="px-6 py-2">
                <h4 className="font-medium ">Usage</h4>
              </div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
            </div>

            <div className="grid grid-cols-5 py-3 border-t">
              <div className="px-6 py-2 text-muted-foreground">Members</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
            </div>

            <div className="grid grid-cols-5 py-3 border-t">
              <div className="px-6 py-2 text-muted-foreground">
                File upload size
              </div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
            </div>

            <div className="grid grid-cols-5 py-3 border-t">
              <div className="px-6 py-2 text-muted-foreground">
                Issues (excluding archive)
              </div>
              <div className="px-6 py-2 text-center border-l ">250</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
            </div>

            <div className="grid grid-cols-5 py-3 border-t">
              <div className="px-6 py-2 text-muted-foreground">Teams</div>
              <div className="px-6 py-2 text-center border-l ">2</div>
              <div className="px-6 py-2 text-center border-l ">5</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
              <div className="px-6 py-2 text-center border-l ">Unlimited</div>
            </div>
          </div>

          {/* Core Features Section */}
          <div className="border-b">
            <div className="grid grid-cols-5 py-4">
              <div className="px-6 py-2">
                <h4 className="font-medium ">Core features</h4>
              </div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
            </div>

            {[
              "Issues, projects, cycles, and milestones",
              "Customer requests",
              "Integrations",
              "API and webhook access",
              "Import and export",
              "Support integrations",
              "Triage responsibility",
              "Triage routing",
              "Sub-initiatives",
              "Issue SLAs",
            ].map((feature, index) => (
              <div key={index} className="grid grid-cols-5 py-3 border-t">
                <div className="px-6 py-2 text-muted-foreground">{feature}</div>
                <div className="px-6 py-2 text-center border-l">
                  <Check className="h-4 w-4 text-blue-500 mx-auto" />
                </div>
                <div className="px-6 py-2 text-center border-l">
                  <Check className="h-4 w-4 text-blue-500 mx-auto" />
                </div>
                <div className="px-6 py-2 text-center border-l">
                  <Check className="h-4 w-4 text-blue-500 mx-auto" />
                </div>
                <div className="px-6 py-2 text-center border-l">
                  <Check className="h-4 w-4 text-blue-500 mx-auto" />
                </div>
              </div>
            ))}
          </div>

          {/* Team Management Section */}
          <div className="border-b">
            <div className="grid grid-cols-5 py-4">
              <div className="px-6 py-2">
                <h4 className="font-medium ">Team management</h4>
              </div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
            </div>

            {[
              {
                name: "Sub-teams",
                free: false,
                basic: false,
                business: true,
                enterprise: true,
              },
              {
                name: "Private teams",
                free: false,
                basic: false,
                business: true,
                enterprise: true,
              },
              {
                name: "Guest accounts",
                free: false,
                basic: false,
                business: true,
                enterprise: true,
              },
            ].map((feature, index) => (
              <div key={index} className="grid grid-cols-5 py-3 border-t">
                <div className="px-6 py-2 text-muted-foreground">
                  {feature.name}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.free && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.basic && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.business && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.enterprise && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Artificial Intelligence Section */}
          <div className="border-b">
            <div className="grid grid-cols-5 py-4">
              <div className="px-6 py-2">
                <h4 className="font-medium ">Artificial Intelligence</h4>
              </div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
            </div>

            {["Linear for Agents", "MCP access", "Product Intelligence*"].map(
              (feature, index) => (
                <div key={index} className="grid grid-cols-5 py-3 border-t">
                  <div className="px-6 py-2 text-muted-foreground">
                    {feature}
                  </div>
                  <div className="px-6 py-2 text-center border-l">
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  </div>
                  <div className="px-6 py-2 text-center border-l">
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  </div>
                  <div className="px-6 py-2 text-center border-l">
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  </div>
                  <div className="px-6 py-2 text-center border-l">
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  </div>
                </div>
              )
            )}
          </div>

          {/* Analytics & Reporting Section */}
          <div className="border-b">
            <div className="grid grid-cols-5 py-4">
              <div className="px-6 py-2">
                <h4 className="font-medium ">Analytics & Reporting</h4>
              </div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
            </div>

            {[
              {
                name: "Progress reports",
                free: false,
                basic: true,
                business: true,
                enterprise: true,
              },
              {
                name: "Insights",
                free: false,
                basic: false,
                business: true,
                enterprise: true,
              },
              {
                name: "Dashboards",
                free: false,
                basic: false,
                business: false,
                enterprise: true,
              },
              {
                name: "Data warehouse sync",
                free: false,
                basic: false,
                business: false,
                enterprise: true,
              },
            ].map((feature, index) => (
              <div key={index} className="grid grid-cols-5 py-3 border-t">
                <div className="px-6 py-2 text-muted-foreground">
                  {feature.name}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.free && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.basic && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.business && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.enterprise && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Linear Asks Section */}
          <div className="border-b">
            <div className="grid grid-cols-5 py-4">
              <div className="px-6 py-2">
                <h4 className="font-medium ">Linear Asks</h4>
              </div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
            </div>

            {[
              {
                name: "Slack intake",
                free: false,
                basic: false,
                business: true,
                enterprise: true,
              },
              {
                name: "Email intake",
                free: false,
                basic: false,
                business: false,
                enterprise: true,
              },
              {
                name: "Multiple Slack workspaces",
                free: false,
                basic: false,
                business: false,
                enterprise: true,
              },
              {
                name: "Private Slack channels",
                free: false,
                basic: false,
                business: false,
                enterprise: true,
              },
              {
                name: "Per-channel configurations",
                free: false,
                basic: false,
                business: false,
                enterprise: true,
              },
            ].map((feature, index) => (
              <div key={index} className="grid grid-cols-5 py-3 border-t">
                <div className="px-6 py-2 text-muted-foreground">
                  {feature.name}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.free && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.basic && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.business && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.enterprise && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Security Section */}
          <div className="border-b">
            <div className="grid grid-cols-5 py-4">
              <div className="px-6 py-2">
                <h4 className="font-medium ">Security</h4>
              </div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
            </div>

            <div className="grid grid-cols-5 py-3 border-t">
              <div className="px-6 py-2 text-muted-foreground">SSO</div>
              <div className="px-6 py-2 text-center border-l ">Google SSO</div>
              <div className="px-6 py-2 text-center border-l ">Google SSO</div>
              <div className="px-6 py-2 text-center border-l ">Google SSO</div>
              <div className="px-6 py-2 text-center border-l ">Google SSO</div>
            </div>

            {[
              {
                name: "Admin roles",
                free: false,
                basic: true,
                business: true,
                enterprise: true,
              },
              {
                name: "Advanced authentication",
                free: false,
                basic: false,
                business: true,
                enterprise: true,
              },
              {
                name: "SCIM provisioning",
                free: false,
                basic: false,
                business: false,
                enterprise: true,
              },
              {
                name: "Domain claiming",
                free: false,
                basic: false,
                business: false,
                enterprise: true,
              },
              {
                name: "Audit log",
                free: false,
                basic: false,
                business: false,
                enterprise: true,
              },
              {
                name: "Third-party app management",
                free: false,
                basic: false,
                business: false,
                enterprise: true,
              },
              {
                name: "HIPAA compliance",
                free: false,
                basic: false,
                business: false,
                enterprise: true,
              },
            ].map((feature, index) => (
              <div key={index} className="grid grid-cols-5 py-3 border-t">
                <div className="px-6 py-2 text-muted-foreground">
                  {feature.name}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.free && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.basic && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.business && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
                <div className="px-6 py-2 text-center border-l">
                  {feature.enterprise && (
                    <Check className="h-4 w-4 text-blue-500 mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Support Section */}
          <div>
            <div className="grid grid-cols-5 py-4">
              <div className="px-6 py-2">
                <h4 className="font-medium ">Support</h4>
              </div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
              <div className="border-l"></div>
            </div>

            <div className="grid grid-cols-5 py-3 border-t">
              <div className="px-6 py-2 text-muted-foreground">
                Priority support
              </div>
              <div className="px-6 py-2 text-center border-l"></div>
              <div className="px-6 py-2 text-center border-l"></div>
              <div className="px-6 py-2 text-center border-l">
                <Check className="h-4 w-4 text-blue-500 mx-auto" />
              </div>
              <div className="px-6 py-2 text-center border-l">
                <Check className="h-4 w-4 text-blue-500 mx-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
        <span>
          Linear contributes 1% of your subscription to remove CO₂ from the
          atmosphere through Stripe Climate.
        </span>
      </div>
    </div>
  );
}
