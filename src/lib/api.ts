import type { Task, TasksResponse, DashboardSummary, TaskFilters } from "@/types";

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) throw data;
  return data as T;
}

function buildQuery(filters: TaskFilters): string {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  return params.toString() ? `?${params.toString()}` : "";
}

export const api = {
  tasks: {
    list: (filters: TaskFilters = {}) =>
      request<TasksResponse>(`/tasks${buildQuery(filters)}`),
    get: (id: string) => request<Task>(`/tasks/${id}`),
    create: (data: Partial<Task>) =>
      request<Task>("/tasks", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Task>) =>
      request<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => request<void>(`/tasks/${id}`, { method: "DELETE" }),
  },
  dashboard: {
    summary: () => request<DashboardSummary>("/dashboard/summary"),
  },
};

