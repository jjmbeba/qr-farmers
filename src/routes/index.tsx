import { createFileRoute } from "@tanstack/react-router";
import { Printer, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppNavigation } from "@/components/app-navigation";
import { FarmerForm } from "@/components/farmer-form";
import { FarmerListSkeleton } from "@/components/farmer-list-skeleton";
import { FarmerQRLabel } from "@/components/farmer-qr-label";
import { LogisticsScanner } from "@/components/logistics-scanner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useDeleteFarmer, useFarmers } from "@/hooks/use-farmers";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const {
    data: registeredFarmers = [],
    isLoading: isLoadingRegisteredFarmers,
  } = useFarmers();
  const deleteFarmerMutation = useDeleteFarmer({
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete farmer. Please try again."
      );
    },
  });
  const [printTargetId, setPrintTargetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"registration" | "logistics">(
    "registration"
  );

  const handlePrintAll = () => {
    setPrintTargetId(null);
    // Slight delay to allow state to propagate before printing
    setTimeout(() => window.print(), 50);
  };

  const handlePrintSingle = (id: string) => {
    setPrintTargetId(id);
    setTimeout(() => window.print(), 50);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AppNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column: Header & Form/Scanner */}
          <div className="flex flex-col space-y-8">
            {activeTab === "registration" ? (
              <>
                {/* Header with Print Button - Visible on screen */}
                <div className="flex w-full max-w-md items-center justify-between print:hidden">
                  <h1 className="font-bold text-3xl tracking-tight">
                    Farmer Management
                  </h1>
                  <Button
                    className="gap-2"
                    onClick={handlePrintAll}
                    size="sm"
                    variant="outline"
                  >
                    <Printer className="h-4 w-4" />
                    Print Stickers
                  </Button>
                </div>

                {/* Screen Content - Hidden when printing */}
                <div className="print:hidden">
                  <FarmerForm />
                </div>
              </>
            ) : (
              <LogisticsScanner />
            )}
          </div>

          {/* Right Column: Farmer List */}
          {activeTab === "registration" && (
            <div className="flex w-full flex-col space-y-4 print:hidden">
              <h2 className="font-semibold text-lg">Registered Farmers</h2>
              {isLoadingRegisteredFarmers && <FarmerListSkeleton />}
              {!isLoadingRegisteredFarmers &&
                registeredFarmers.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm">
                    No farmers registered yet.
                  </p>
                )}
              {!isLoadingRegisteredFarmers && registeredFarmers.length > 0 && (
                <div className="flex flex-col gap-2">
                  {registeredFarmers.map((farmer) => (
                    <div
                      className="flex items-center justify-between rounded-md border p-3 shadow-sm"
                      key={farmer.id}
                    >
                      <div>
                        <p className="font-medium">{farmer.name}</p>
                        <p className="font-mono text-muted-foreground text-xs">
                          {farmer.id}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {farmer.assignedCrops.map((crop) => (
                            <span
                              className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground text-xs"
                              key={crop}
                            >
                              {crop}
                            </span>
                          ))}
                        </div>
                        <Button
                          className="h-8 w-8 text-muted-foreground"
                          onClick={() => handlePrintSingle(farmer.id)}
                          size="icon"
                          title="Print single label"
                          variant="ghost"
                        >
                          <Printer className="h-4 w-4" />
                          <span className="sr-only">Print</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger
                            render={
                              <Button
                                className="h-8 w-8 text-destructive"
                                size="icon"
                                title="Delete farmer"
                                variant="ghost"
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            }
                          />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the farmer and remove their
                                data from the database.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className={cn(
                                  buttonVariants({ variant: "destructive" })
                                )}
                                disabled={deleteFarmerMutation.isPending}
                                onClick={() => {
                                  deleteFarmerMutation.mutate(farmer.id);
                                }}
                              >
                                {deleteFarmerMutation.isPending
                                  ? "Deleting..."
                                  : "Continue"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Print Content - Visible only when printing */}
        {activeTab === "registration" && (
          <div className="hidden w-full print:grid print:grid-cols-3 print:gap-4">
            {(printTargetId
              ? registeredFarmers.filter((f) => f.id === printTargetId)
              : registeredFarmers
            ).map((farmer) => (
              <FarmerQRLabel farmer={farmer} key={farmer.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
