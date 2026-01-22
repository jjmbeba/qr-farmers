import { QRCodeSVG } from "qrcode.react";
import type { z } from "zod";
import type { farmerSchema } from "@/schema/farmer";

type Farmer = z.infer<typeof farmerSchema>;

interface FarmerQRLabelProps {
  farmer: Farmer;
}

export function FarmerQRLabel({ farmer }: FarmerQRLabelProps) {
  // Format: AGRI-v1|ID|Name|Crops
  const qrData = `AGRI-v1|${farmer.id}|${farmer.name}|${farmer.assignedCrops.join(",")}`;

  return (
    <div className="flex h-[200px] w-[200px] break-inside-avoid flex-col items-center justify-center rounded-lg border-2 border-border border-dashed p-4 shadow-sm print:border-gray-300">
      <QRCodeSVG
        className="mb-2"
        includeMargin={true}
        level="H"
        size={120}
        value={qrData}
      />
      <div className="w-full text-center">
        <p className="truncate font-bold text-sm">{farmer.name}</p>
        <p className="font-mono text-[10px] text-muted-foreground print:text-gray-500">
          {farmer.id}
        </p>
      </div>
    </div>
  );
}
