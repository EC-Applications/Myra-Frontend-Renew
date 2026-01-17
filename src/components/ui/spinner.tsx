import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { FC } from "react";

interface SpinnerProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

// Functional component with TypeScript
const Spinner: FC<SpinnerProps> = ({ className, size = "md" }) => {
  return (
    <Loader2
      className={cn(
        "animate-spin text-primary",
        size === "xs" && "size-5",
        size === "sm" && "size-6",
        size === "md" && "size-8",
        size === "lg" && "size-12",
        className
      )}
      role="status"
      aria-hidden="true"
    />
  );
};

export default Spinner;
