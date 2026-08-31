import React from "react";
import Image from "next/image";

export interface PolaroidCardProps {
  imageUrl?: string | null;
  caption: string;
  subcaption?: string;
  tilt?: "left" | "right" | "none";
}

export function PolaroidCard({ imageUrl, caption, subcaption, tilt = "none" }: PolaroidCardProps) {
  const tiltClass = tilt === "left" ? "-rotate-2" : tilt === "right" ? "rotate-2" : "";

  return (
    <div className={`bg-white p-3 pb-8 shadow-md border border-gray-200 inline-block w-full max-w-sm transition-transform hover:rotate-0 hover:z-10 relative ${tiltClass}`}>
      <div className="aspect-square w-full bg-gray-100 relative mb-4 flex items-center justify-center overflow-hidden border border-gray-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={caption} fill className="object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No photo</span>
        )}
      </div>
      <div className="font-handwriting text-center text-gray-800">
        <p className="text-lg leading-tight">{caption}</p>
        {subcaption && <p className="text-xs text-gray-500 mt-1">{subcaption}</p>}
      </div>
    </div>
  );
}
