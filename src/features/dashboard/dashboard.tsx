"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, Clock, LayoutDashboard } from "lucide-react";

export function Dashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.dashboard.summary,
  });

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load dashboard.{" "}
        <button onClick={() => refetch()} className="underline">
          Retry
        </button>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Tasks",
      value: data?.total ?? 0,
      icon: <LayoutDashboard className="h-5 w-5 text-indigo-500" />,
      bg: "bg-indigo-50 border-indigo-200",
    },
    {
      label: "To Do",
      value: data?.byStatus.TODO ?? 0,
      icon: <Circle className="h-5 w-5 text-gray-500" />,
      bg: "bg-gray-50 border-gray-200",
    },
    {
      label: "In Progress",
      value: data?.byStatus.IN_PROGRESS ?? 0,
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      bg: "bg-blue-50 border-blue-200",
    },
    {
      label: "Done",
      value: data?.byStatus.DONE ?? 0,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      bg: "bg-green-50 border-green-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-lg border p-4 ${card.bg} flex flex-col gap-1`}
        >
          <div className="flex items-center gap-2">
            {card.icon}
            <span className="text-xs font-medium text-gray-500">{card.label}</span>
          </div>
          <span className="text-3xl font-bold text-gray-800">{card.value}</span>
        </div>
      ))}
    </div>
  );
}

