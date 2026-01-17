import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";

export function Billing() {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Billing</h1>
          <p className="text-muted-foreground">
            For questions about billing,{" "}
            <a href="#" className="underline hover:no-underline">
              contact us
            </a>
          </p>
        </div>
        <Link
          to={"./plans"}
          className="text-muted-foreground flex items-center gap-1"
        >
          All plans →
        </Link>
      </div>

      {/* Current Plan - Free */}
      <Card className="py-3">
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-medium">Free</h2>
                <Badge variant="secondary" className="px-2 py-1">
                  Current plan
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm">
                Free for all users
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Users</div>
              <div className="text-lg font-medium">1</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Plan */}
      <Card className="py-3">
        <CardContent>
          <div className="flex gap-8">
            <div className="flex-shrink-0">
              <h2 className="text-lg font-medium">Basic</h2>
              <p className="text-muted-foreground text-sm mb-3">
                $10 per user/mo
              </p>
              <Button>Upgrade plan</Button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">5 teams</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Unlimited file upload size
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Unlimited issues
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Admin roles
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Restrict new user invitations
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Restrict agent invocation to...
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <div className="space-y-4">
        <h2 className="text-xl font-medium ">Recent invoices</h2>
        <Card>
          <CardContent>
            <p className="text-muted-foreground">No invoices yet</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
