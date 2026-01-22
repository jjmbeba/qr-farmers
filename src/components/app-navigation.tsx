import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppNavigationProps {
  activeTab: "registration" | "logistics";
  onTabChange: (tab: "registration" | "logistics") => void;
}

export function AppNavigation({ activeTab, onTabChange }: AppNavigationProps) {
  return (
    <div className="flex w-full items-center justify-center border-b bg-background p-2 print:hidden">
      <div className="flex w-full max-w-md items-center justify-center gap-2 rounded-lg bg-muted p-1">
        <Button
          className={cn(
            "flex-1 rounded-md transition-all",
            activeTab === "registration"
              ? "bg-background text-foreground shadow-sm hover:bg-background/90"
              : "text-muted-foreground hover:bg-transparent hover:text-foreground"
          )}
          onClick={() => onTabChange("registration")}
          size="sm"
          variant={activeTab === "registration" ? "default" : "ghost"}
        >
          Registration
        </Button>
        <Button
          className={cn(
            "flex-1 rounded-md transition-all",
            activeTab === "logistics"
              ? "bg-background text-foreground shadow-sm hover:bg-background/90"
              : "text-muted-foreground hover:bg-transparent hover:text-foreground"
          )}
          onClick={() => onTabChange("logistics")}
          size="sm"
          variant={activeTab === "logistics" ? "default" : "ghost"}
        >
          Logistics Scanner
        </Button>
      </div>
    </div>
  );
}
