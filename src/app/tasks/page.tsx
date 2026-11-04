import { TasksView } from "@/features/tasks/tasks-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Tasks – Savytics Project Tracker",
  description: "View, filter, search, and manage project tasks.",
};

export default function TasksPage() {
  return <TasksView />;
}

