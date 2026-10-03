"use client";

interface AdSlotProps {
  slot?: string;
  className?: string;
}

export function AdSlot({ slot, className = "" }: AdSlotProps) {
  return (
    <div className={`my-8 flex flex-col items-center justify-center ${className}`} role="complementary" aria-label="Advertisement">
      <span className="text-[10px] uppercase tracking-wider text-text-muted mb-1 font-semibold">Advertisement</span>
      
      {process.env.NODE_ENV === "development" ? (
        <div className="w-full max-w-[728px] h-[90px] bg-bg-tertiary border border-dashed border-border-strong rounded flex items-center justify-center">
          <p className="text-sm text-text-muted">AdSense Placeholder: {slot || "default"}</p>
        </div>
      ) : (
        <div className="w-full min-h-[90px] flex items-center justify-center">
          {/* Google AdSense integration - waiting for approval */}
          <ins className="adsbygoogle"
               style={{ display: "block", textAlign: "center" }}
               data-ad-layout="in-article"
               data-ad-format="fluid"
               data-ad-client="ca-pub-YOUR_ADSENSE_ID"
               data-ad-slot={slot || "default"}></ins>
          <script dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }} />
        </div>
      )}
    </div>
  );
}