"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter, LayoutGrid, Search } from "lucide-react";
import NewCustomer from "./components/new-customer";
import { Link } from "react-router";

interface Customer {
  id: string;
  name: string;
  avatar: string;
  requests: number;
  annualRevenue: string;
  size: string;
  status: "active" | "inactive";
  tier: string;
  owner: {
    name: string;
    avatar: string;
  };
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Ahmed Saif",
    avatar: "/ahmed-saif.png",
    requests: 0,
    annualRevenue: "",
    size: "",
    status: "active",
    tier: "",
    owner: {
      name: "Ahmed Saif",
      avatar: "/ahmed-saif.png",
    },
  },
];

const Customers = () => {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">Customers</h1>
              <Badge variant="secondary" className="rounded-full">
                {customers.length}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowCreateDialog(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New customer
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Find customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="border-b bg-background px-6 py-3">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Display
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-full">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 px-6 py-3 text-sm font-medium text-muted-foreground border-b bg-muted/30">
              <div>Name</div>
              <div>Requests</div>
              <div>Annual revenue</div>
              <div>Size</div>
              <div>Status</div>
              <div>Tier</div>
              <div>Owner</div>
            </div>

            {/* Table Rows */}
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="grid grid-cols-7 gap-4 px-6 py-4 text-sm border-b hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-muted text-xs font-medium">
                    A
                  </div>
                  <Link to={"./" + customer.id} className="font-medium">
                    {customer.name}
                  </Link>
                </div>
                <div className="flex items-center text-muted-foreground">
                  {customer.requests || "—"}
                </div>
                <div className="flex items-center text-muted-foreground">
                  {customer.annualRevenue || "—"}
                </div>
                <div className="flex items-center text-muted-foreground">
                  {customer.size || "—"}
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="capitalize">{customer.status}</span>
                  </div>
                </div>
                <div className="flex items-center text-muted-foreground">
                  {customer.tier || "—"}
                </div>
                <div className="flex items-center">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={customer.owner.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback className="text-xs">
                      {customer.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewCustomer open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>
  );
};
export default Customers;
