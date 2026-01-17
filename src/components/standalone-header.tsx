import { useUser } from "@/hooks/use-user";
import type { iUserResponse } from "@/interfaces/auth.interface";
import { logout } from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import {
  changeAccount,
  logout as logoutAction,
} from "@/store/slices/auth.slice";

import { ChevronLeft } from "lucide-react";
import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Spinner from "./ui/spinner";
import { cn } from "@/lib/utils";

interface componentProps {
  addAccount: boolean;
}

const StandaloneHeader: FC<componentProps> = ({ addAccount }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const { currentUser, currentWorkspace } = useUser();
  const users = useAppSelector((x) => x.auth.users);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const switchAccount = (user: iUserResponse) => {
    dispatch(changeAccount(user));
    setTimeout(() => window.location.reload(), 100);
  };
  const handleLogout = () => {
    if (!loggingOut) {
      setLoggingOut(true);
      logout()
        .then(
          () => {
            dispatch(logoutAction());
          },
          (er) => {
            console.warn(er);
            toast.error("Something went wrong while trying to logout.");
          }
        )
        .finally(() => setLoggingOut(false));
    }
  };

  return (
    <header
      className={cn(
        "flex items-start p-6 pt-8",
        currentWorkspace != null || !addAccount
          ? "justify-between"
          : "justify-end"
      )}
    >
      {currentWorkspace || !addAccount ? (
        <Button
          variant="ghost"
          className="text-muted-foreground"
          onClick={() => navigate("/", { replace: true })}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Myra
        </Button>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto text-left focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Logged in as
                </div>
                <div className="text-sm text-foreground">
                  {currentUser!.email}
                </div>
              </div>
            </>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start" side="left">
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Accounts
          </DropdownMenuLabel>
          {Object.values(users).map((x: iUserResponse) => (
            <DropdownMenuCheckboxItem
              checked={currentUser!.id == x.id}
              onCheckedChange={(e) => {
                if (e) switchAccount(x);
              }}
            >
              <span className="truncate">{x.email}</span>
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          {addAccount ? (
            <DropdownMenuItem onClick={() => navigate("/add-account")}>
              Add Account
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? (
              <>
                <Spinner size="xs" /> Logging out
              </>
            ) : (
              "Log out"
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default StandaloneHeader;
