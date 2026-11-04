"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { TaskCardSkeleton } from "@/components/ui/skeleton";
import { TaskForm } from "@/features/tasks/task-form";
import { formatDate, STATUS_LABELS } from "@/lib/utils";
import { toast } from "sonner";
import type { Task, TaskFilters, Status } from "@/types";
import { Pencil, Trash2, Plus, Search, X, AlertCircle } from "lucide-react";

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounced;
}

export function TaskList() {
  const qc = useQueryClient();
  const [filters, setFilters] = useState<TaskFilters>({ sort: "newest", page: 1 });
  const [search, setSearch] = useState("");
  const [modalTask, setModalTask] = useState<Task | null | "new">(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const activeFilters = { ...filters, search: debouncedSearch || undefined };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tasks", activeFilters],
    queryFn: () => api.tasks.list(activeFilters),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["tasks"] });
    qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const deleteMutation = useMutation({
    mutationFn: api.tasks.delete,
    onSuccess: () => { toast.success("Task deleted"); invalidate(); setDeleteId(null); },
    onError: () => toast.error("Failed to delete task"),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      api.tasks.update(id, { status }),
    onSuccess: () => { toast.success("Status updated"); invalidate(); },
    onError: () => toast.error("Failed to update status"),
  });

  const setFilter = (key: keyof TaskFilters, value: string) =>
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }));

  const clearFilters = () => {
    setSearch("");
    setFilters({ sort: "newest", page: 1 });
  };

  const hasActiveFilters =
    search || filters.status || filters.priority || filters.sort !== "newest";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filters.status ?? ""}
            onChange={(e) => setFilter("status", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
          <select
            value={filters.priority ?? ""}
            onChange={(e) => setFilter("priority", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <select
            value={filters.sort ?? "newest"}
            onChange={(e) => setFilter("sort", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
          </select>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-50"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
          <button
            onClick={() => setModalTask("new")}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> New Task
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <TaskCardSkeleton key={i} />)}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load tasks.{" "}
          <button onClick={() => refetch()} className="underline">Retry</button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && data?.tasks.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <p className="text-gray-500 text-sm">
            {hasActiveFilters ? "No tasks match your filters." : "No tasks yet."}
          </p>
          {!hasActiveFilters && (
            <button
              onClick={() => setModalTask("new")}
              className="mt-3 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" /> Create your first task
            </button>
          )}
        </div>
      )}

      {/* Task Cards */}
      {!isLoading && !isError && data && data.tasks.length > 0 && (
        <div className="space-y-3">
          {data.tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
                  {task.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{task.description}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    Updated {formatDate(task.updatedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => setModalTask(task)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    aria-label="Edit task"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(task.id)}
                    className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge value={task.priority} type="priority" />
                <select
                  value={task.status}
                  onChange={(e) =>
                    statusMutation.mutate({ id: task.id, status: e.target.value as Status })
                  }
                  className="rounded-full border border-gray-200 bg-transparent px-2.5 py-0.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-300"
                  aria-label="Change status"
                >
                  {Object.entries(STATUS_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-gray-500">
            Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} tasks)
          </span>
          <div className="flex gap-2">
            <button
              disabled={data.pagination.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              className="rounded-lg border px-3 py-1 text-sm disabled:opacity-40 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {modalTask !== null && (
        <TaskForm
          task={modalTask === "new" ? null : modalTask}
          onClose={() => setModalTask(null)}
          onSuccess={() => { invalidate(); setModalTask(null); }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-gray-900">Delete task?</h2>
            <p className="mt-1 text-sm text-gray-500">
              This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

