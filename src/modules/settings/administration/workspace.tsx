import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Edit } from "lucide-react"

export function Workspace() {
  return (
    <div className="min-h-screen">
      <div className="w-full max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-semibold mb-8">Workspace</h1>

        <div className="space-y-8">
          <div>
            <div className="bg-card border border-border rounded-lg">
              {/* Logo Section */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Logo</h3>
                  <p className="text-sm text-muted-foreground">Recommended size is 256x256px</p>
                </div>
                <Avatar className="h-12 w-12 bg-blue-600">
                  <AvatarFallback className="bg-blue-600 text-white font-semibold text-base">MA</AvatarFallback>
                </Avatar>
              </div>

              <Separator />

              {/* Name Section */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Name</h3>
                </div>
                <Input value="MARS" className="w-48 bg-background border-border text-foreground" readOnly />
              </div>

              <Separator />

              {/* URL Section */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">URL</h3>
                </div>
                <div className="relative">
                  <div className="flex items-center w-64 bg-background border border-border rounded-md px-3 py-2 pr-10">
                    <span className="text-muted-foreground">linear.app/</span>
                    <span className="text-foreground font-medium">mars06</span>
                  </div>
                  <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 h-7 w-7">
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">Time & region</h2>
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">First month of the fiscal year</h3>
                  <p className="text-sm text-muted-foreground">
                    Used when grouping projects and issues quarterly, half-yearly, and yearly
                  </p>
                </div>
                <Select defaultValue="january">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="january">January</SelectItem>
                    <SelectItem value="february">February</SelectItem>
                    <SelectItem value="march">March</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Region</h3>
                  <p className="text-sm text-muted-foreground">
                    Set when a workspace is created and cannot be changed.{" "}
                    <span className="text-blue-500 hover:text-blue-400 cursor-pointer">Read more →</span>
                  </p>
                </div>
                <div className="text-foreground">European Union</div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-medium mb-3 ms-1">Danger zone</h2>
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">Delete workspace</h3>
                  <p className="text-sm text-muted-foreground">Schedule workspace to be permanently deleted</p>
                </div>
                <Button variant="destructive">Delete workspace</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
