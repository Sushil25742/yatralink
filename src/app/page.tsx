"use client"
import dynamic from "next/dynamic";
import "@/components/ref/access.css";
import "@/components/ref/management.css";
import "@/components/ref/functional-screens.css";
import "@/components/ref/yatralink.css";
import "leaflet/dist/leaflet.css";

// Dynamically load the entire original SPA to prevent SSR Leaflet errors
const AccessPortal = dynamic(() => import("@/components/ref/AccessPortal"), { ssr: false });

export default function RootApp() {
  return <AccessPortal />;
}
