"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  Clock,
  Filter,
  Link,
  Minus,
  MoreHorizontal,
  Paperclip,
  Plus,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";

interface CustomerRequest {
  id: string;
  title: string;
  timestamp: string;
  author: string;
  content: string;
  addedTime: string;
}

export default function CustomerDetail() {
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [newRequestDetails, setNewRequestDetails] = useState("");
  const [expandedRequests, setExpandedRequests] = useState<Set<string>>(
    new Set()
  );

  const customer = {
    name: "Ahmed Saif",
    avatar: "M",
    status: "Active",
    owner: {
      name: "techwolf",
      avatar: "/techwolf-avatar.png",
    },
  };

  const requests: CustomerRequest[] = [
    {
      id: "1",
      title: "Customer request from Ahmed Saif",
      timestamp: "16min",
      author: "techwolf",
      content: "Another issue",
      addedTime: "16 minutes ago",
    },
    {
      id: "2",
      title: "Customer request from Ahmed Saif",
      timestamp: "18min",
      author: "techwolf",
      content: "Customer needs help with login functionality",
      addedTime: "18 minutes ago",
    },
  ];

  const toggleRequest = (requestId: string) => {
    const newExpanded = new Set(expandedRequests);
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId);
    } else {
      newExpanded.add(requestId);
    }
    setExpandedRequests(newExpanded);
  };

  const handleAddRequest = () => {
    setNewRequestDetails("");
    setShowAddRequest(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Customers</span>
            <span className="text-muted-foreground">›</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded flex items-center justify-center text-xs font-medium">
                M
              </div>
              <span className="font-medium">Ahmed Saif</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Link className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Customer Profile */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-2xl font-bold">
              {customer.avatar}
            </div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
          </div>

          <div className="flex items-center gap-8">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Status</div>
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-blue-500 border-blue-500/20"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                {customer.status}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Owner</div>
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="bg-green-500 text-white text-xs">
                    TW
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
                  {customer.owner.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Requests{" "}
              <span className="text-muted-foreground">{requests.length}</span>
            </h2>
            <div className="flex items-center gap-2">
              {/* <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
              </Button> */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAddRequest(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add request
              </Button>
            </div>
          </div>

          {/* Add Request Form */}
          {showAddRequest && (
            <Card className="p-4 mb-6 bg-card border-border">
              <Textarea
                placeholder="Add request details"
                value={newRequestDetails}
                onChange={(e) => setNewRequestDetails(e.target.value)}
                className="min-h-[120px] mb-4 resize-none border-0 dark:bg-transparent p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Source
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddRequest(false)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddRequest}>
                    Add request
                  </Button>
                </div>
              </div>

              <div className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                This request will be added to
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>New issue</span>
                  <span className="font-medium">
                    Customer request from {customer.name}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </Card>
          )}

          {/* Request List */}
          <div className="space-y-3">
            {requests.map((request) => {
              const isExpanded = expandedRequests.has(request.id);

              return (
                <div
                  key={request.id}
                  className="border-b border-border last:border-0"
                >
                  <div
                    className="flex items-center justify-between py-3 cursor-pointer hover:bg-muted/50 rounded px-2 -mx-2"
                    onClick={() => toggleRequest(request.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{request.title}</span>
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {request.timestamp}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pb-4 pl-7">
                      <div className="text-sm text-muted-foreground mb-2">
                        Added by {request.author} {request.addedTime}
                      </div>
                      <div className="text-sm">{request.content}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
