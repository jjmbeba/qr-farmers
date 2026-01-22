import { Html5Qrcode } from "html5-qrcode";
import { Camera, CheckCircle, QrCode, RefreshCw, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ParsedFarmerData {
  version: string;
  id: string;
  name: string;
  crops: string[];
}

export function LogisticsScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<ParsedFarmerData | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize Html5Qrcode instance
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("reader");
      }
    } catch (e) {
      console.error("Failed to initialize scanner", e);
    }

    // Start scanning automatically if not already successful
    if (!(scannedData || isScanning)) {
      const timer = setTimeout(() => {
        startScanning();
      }, 100);
      return () => clearTimeout(timer);
    }

    return () => {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current
            .stop()
            .then(() => {
              try {
                scannerRef.current?.clear();
              } catch (e) {
                // Ignore clear errors
              }
            })
            .catch((err) => {
              console.warn("Scanner stop error during cleanup", err);
            });
        } else {
          try {
            scannerRef.current.clear();
          } catch (e) {
            // Ignore clear errors
          }
        }
      }
    };
  }, []);

  const handleScanSuccess = (decodedText: string) => {
    if (!decodedText.startsWith("AGRI-v1")) {
      toast.error("Invalid Agri-ID Format");
      return;
    }

    try {
      const parts = decodedText.split("|");
      if (parts.length < 4) {
        toast.error("Incomplete QR Data");
        return;
      }

      const [version, id, name, cropsString] = parts;
      const crops = cropsString.split(",");

      setScannedData({
        version,
        id,
        name,
        crops,
      });
      stopScanning();
    } catch (e) {
      console.error("Parsing error", e);
      toast.error("Failed to parse QR code");
    }
  };

  const startScanning = async () => {
    if (!scannerRef.current) return;
    if (!document.getElementById("reader")) return;

    try {
      if (scannerRef.current.isScanning) return;

      setIsScanning(true);
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        handleScanSuccess,
        () => {}
      );
    } catch (err) {
      console.error("Error starting scanner", err);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner", err);
        setIsScanning(false);
      }
    } else {
      setIsScanning(false);
    }
  };

  const handleScanNext = () => {
    setScannedData(null);
    setTimeout(() => {
      startScanning();
    }, 100);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!(file && scannerRef.current)) return;

    try {
      if (isScanning) {
        await stopScanning();
      }

      const decodedText = await scannerRef.current.scanFileV2(file, true);
      handleScanSuccess(decodedText as string);
    } catch (err) {
      console.error("Error scanning file", err);
      toast.error("Could not find QR code in image");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex w-full flex-col items-center justify-center space-y-6">
      <div className="text-center">
        <h2 className="font-bold text-2xl tracking-tight">Logistics Scanner</h2>
        <p className="text-muted-foreground text-sm">
          Scan a bag's QR code to verify farmer details
        </p>
      </div>

      <div className="w-full max-w-md">
        {scannedData ? (
          <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/10">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <CardTitle className="text-green-700 dark:text-green-400">
                Verified Farmer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="grid grid-cols-[auto_1fr] gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <QrCode className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-lg">{scannedData.name}</p>
                    <p className="font-mono text-muted-foreground text-xs">
                      ID: {scannedData.id}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-medium text-muted-foreground text-xs uppercase">
                    Assigned Crops
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {scannedData.crops.map((crop) => (
                      <span
                        className="rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground text-xs"
                        key={crop}
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button
                className="w-full gap-2"
                onClick={handleScanNext}
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
                Scan Next
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="overflow-hidden border-2 border-dashed">
            <CardContent className="relative p-0">
              {/* 
                CRITICAL FIX: 
                The #reader div must be empty and managed solely by html5-qrcode.
                Any React children must be in a sibling overlay div to prevent 
                "Node.removeChild" DOM conflicts.
              */}
              <div className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden bg-muted">
                <div className="h-full w-full" id="reader" />

                {!isScanning && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-muted/80">
                    <Camera className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="mb-4 text-muted-foreground text-sm">
                      Camera inactive
                    </p>
                    <Button onClick={startScanning} size="sm">
                      Start Camera
                    </Button>
                  </div>
                )}

                {/* Overlay guidelines when scanning */}
                {isScanning && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative h-64 w-64 rounded-lg border-2 border-primary/50">
                      <div className="absolute top-0 left-0 h-4 w-4 border-primary border-t-2 border-l-2" />
                      <div className="absolute top-0 right-0 h-4 w-4 border-primary border-t-2 border-r-2" />
                      <div className="absolute bottom-0 left-0 h-4 w-4 border-primary border-b-2 border-l-2" />
                      <div className="absolute right-0 bottom-0 h-4 w-4 border-primary border-r-2 border-b-2" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 border-t bg-muted/20 p-4">
              <div className="flex w-full items-center justify-between gap-4">
                <p className="text-muted-foreground text-xs">
                  Position QR code within the frame
                </p>
                <Button
                  className="gap-2"
                  onClick={triggerFileUpload}
                  size="sm"
                  variant="outline"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Image
                </Button>
                <input
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  type="file"
                />
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
