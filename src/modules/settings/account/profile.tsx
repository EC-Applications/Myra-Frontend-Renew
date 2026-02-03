import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/use-user";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useState } from "react";

const Profile = () => {
  const [fullName, setFullName] = useState("Tech Wolf");
  const [username, setUsername] = useState("techwolf");
  const { currentUser } = useUser();

  return (
    <>
      {/* Main Content */}
      <div className="min-h-screen">
        <div className="w-full max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-semibold mb-8">Profile</h1>

          {/* Profile Section */}
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Profile picture</h3>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser?.avatar || "./placeholder"} />
                    <AvatarFallback className="bg-[#5e6ad2] text-white font-medium">
                      {currentUser?.name.slice(0, 2).toUpperCase() ||
                        currentUser?.email.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Email</h3>
                    </div>
                    <div className="w-48">
                      <Input
                        value={currentUser?.email}
                        className="bg-background border-border"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Full name</h3>
                    </div>
                    <div className="w-48">
                      <Input
                        value={currentUser?.name}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Username</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Nickname or first name, however you want to be called in
                        MyRa
                      </p>
                    </div>
                    <div className="w-48">
                      <Input
                        value={currentUser?.name}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Workspace Access Section */}
            <div>
              <h2 className="text-lg font-medium mb-4">Workspace access</h2>
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">
                      Remove yourself from workspace
                    </h3>
                  </div>
                  <Button variant="destructive" size="sm">
                    Leave workspace
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
