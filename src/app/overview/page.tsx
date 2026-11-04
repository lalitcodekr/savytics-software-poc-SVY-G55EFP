import { OverviewView } from "@/features/overview/overview-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Overview – Savytics POC",
  description: "Comprehensive project status, priority distribution, and sprint health metrics.",
};

export default function OverviewPage() {
  return <OverviewView />;
}

