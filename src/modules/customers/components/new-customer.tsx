"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { useState } from "react";

interface CreateCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewCustomer({
  open,
  onOpenChange,
}: CreateCustomerDialogProps) {
  const [customerData, setCustomerData] = useState({
    name: "",
    owner: "no-owner",
    status: "active",
    tier: "no-tier",
    annualRevenue: "",
    size: "",
    domain: "customer.com",
  });

  const handleSubmit = () => {
    // Handle customer creation
    console.log("Creating customer:", customerData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-3xl" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Create customer</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Logo</Label>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-sm text-muted-foreground">
                Recommended size is 128 x 128px.
              </div>
            </div>
          </div>

          {/* Name and Owner */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Customer name"
                value={customerData.name}
                onChange={(e) =>
                  setCustomerData({ ...customerData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Select
                value={customerData.owner}
                onValueChange={(value) =>
                  setCustomerData({ ...customerData, owner: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-owner">No owner</SelectItem>
                  <SelectItem value="ahmed-saif">Ahmed Saif</SelectItem>
                  <SelectItem value="john-doe">John Doe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status and Tier */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={customerData.status}
                onValueChange={(value) =>
                  setCustomerData({ ...customerData, status: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400" />
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <Select
                value={customerData.tier}
                onValueChange={(value) =>
                  setCustomerData({ ...customerData, tier: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-tier">No tier</SelectItem>
                  <SelectItem value="bronze">Bronze</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Annual Revenue and Size */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Annual revenue</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="revenue"
                  className="pl-8"
                  value={customerData.annualRevenue}
                  onChange={(e) =>
                    setCustomerData({
                      ...customerData,
                      annualRevenue: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                value={customerData.size}
                onChange={(e) =>
                  setCustomerData({ ...customerData, size: e.target.value })
                }
              />
            </div>
          </div>

          {/* Domains */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="domain">Domains</Label>
              <Button
                variant="ghost"
                size="sm"
                className="text-sm text-muted-foreground"
              >
                Add domain
              </Button>
            </div>
            <Input
              id="domain"
              value={customerData.domain}
              onChange={(e) =>
                setCustomerData({ ...customerData, domain: e.target.value })
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create customer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
