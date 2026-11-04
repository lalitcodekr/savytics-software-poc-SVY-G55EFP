export type Priority = "LOW" | "MEDIUM" | "HIGH";
export type Status = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: PaginationMeta;
}

export interface DashboardSummary {
  total: number;
  byStatus: { TODO: number; IN_PROGRESS: number; DONE: number };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
  };
}

export interface TaskFilters {
  search?: string;
  status?: Status | "";
  priority?: Priority | "";
  sort?: "newest" | "oldest" | "priority";
  page?: number;
}

