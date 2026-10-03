"use client";

import dynamic from "next/dynamic";

const ToolsClient = dynamic(() => import("./ToolsClient"), {
  ssr: false,
});

export default function ToolsPage() {
  return <ToolsClient />;
}