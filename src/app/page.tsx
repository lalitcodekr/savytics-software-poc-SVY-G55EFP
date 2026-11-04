import { Dashboard } from "@/features/dashboard/dashboard";
import { TaskList } from "@/features/tasks/task-list";
import { ClipboardList } from "lucide-react";

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
          <ClipboardList className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Project Tracker</h1>
          <p className="text-sm text-gray-500">Savytics POC · SVY-G55EFP</p>
        </div>
      </div>

      {/* Dashboard summary */}
      <section className="mb-8" aria-label="Progress summary">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Overview
        </h2>
        <Dashboard />
      </section>

      {/* Task list */}
      <section aria-label="Task list">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
          Tasks
        </h2>
        <TaskList />
      </section>
    </main>
  );
}
