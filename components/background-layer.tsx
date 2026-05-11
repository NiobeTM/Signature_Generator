"use client";

import Image from "next/image";
import { useState } from "react";

export function BackgroundLayer() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-0" style={{ pointerEvents: "none" }}>
      {/* Fallback color while the image loads */}
      <div className="absolute inset-0" style={{ backgroundColor: "#0b0b0b", opacity: loaded ? 0 : 1 }} />
      <Image
        src="/app-bg.png"
        alt=""
        fill
        priority
        unoptimized
        sizes="100vw"
        style={{ objectFit: "cover" }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

