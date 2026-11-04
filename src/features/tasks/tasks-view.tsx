"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useTaskModal } from "@/context/task-modal-context";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TaskStatusDropdown } from "@/components/tasks/task-status-dropdown";
import { EmptyState } from "@/components/common/empty-state";
import { TaskCardSkeleton } from "@/components/ui/skeleton";
import type { TaskFilters, Status, Priority } from "@/types";
import {
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export function TasksView() {
  const { openCreateTask, openEditTask, openDeleteTask, globalSearch, setGlobalSearch } = useTaskModal();

  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "priority">("newest");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(globalSearch, 300);

  const activeFilters: TaskFilters = {
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    sort: sortOrder,
    page,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tasks", activeFilters],
    queryFn: () => api.tasks.list(activeFilters),
  });

  const { data: summary } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.dashboard.summary,
  });

  const clearFilters = () => {
    setGlobalSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setSortOrder("newest");
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    globalSearch || statusFilter || priorityFilter || sortOrder !== "newest"
  );

  const totalTasksInDb = summary?.total ?? 0;
  const filteredTotal = data?.pagination.total ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-[24px] border-[3px] border-[#252b3a] bg-white shadow-[5px_5px_0_0_#252b3a]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#252b3a] bg-[#e9fff5] text-[#253044] text-xs font-bold shadow-[2px_2px_0_0_#252b3a] mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0a7544]" />
            <span>Task Management Hub</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#253044] tracking-tight">
              My Tasks
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border-2 border-[#252b3a] bg-[#f1ebff] text-xs font-bold text-[#6434df] shadow-[1.5px_1.5px_0_0_#252b3a]">
              {totalTasksInDb} {totalTasksInDb === 1 ? "task" : "tasks"}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#253044]/75 max-w-xl">
            Create, filter, sort, and organize all project deliverables and engineering tasks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => openCreateTask()}
            className="geo-interactive flex items-center gap-2 rounded-xl border-[2.5px] border-[#252b3a] bg-[#6434df] px-4 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_0_#252b3a] hover:bg-[#5227c2] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 2. Task Toolbar & Filter Strip */}
      <div className="rounded-[20px] border-[2.5px] border-[#252b3a] bg-white p-4 sm:p-5 shadow-[4px_4px_0_0_#252b3a]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#253044]/50" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search tasks by title or description..."
              className="w-full rounded-xl border-2 border-[#252b3a] bg-[#fffdf5] py-2 pl-9 pr-8 text-sm font-medium text-[#253044] placeholder-[#253044]/45 shadow-[2px_2px_0_0_#252b3a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6434df]"
            />
            {globalSearch && (
              <button
                type="button"
                onClick={() => {
                  setGlobalSearch("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#253044]/50 hover:text-[#253044]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <div className="relative">
              <select
                aria-label="Filter by Status"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as Status | "");
                  setPage(1);
                }}
                className={`rounded-xl border-2 border-[#252b3a] px-3 py-2 text-xs font-bold shadow-[2px_2px_0_0_#252b3a] cursor-pointer focus:outline-none transition-all ${
                  statusFilter ? "bg-[#f1ebff] text-[#6434df]" : "bg-white text-[#253044]"
                }`}
              >
                <option value="">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="relative">
              <select
                aria-label="Filter by Priority"
                value={priorityFilter}
                onChange={(e) => {
                  setPriorityFilter(e.target.value as Priority | "");
                  setPage(1);
                }}
                className={`rounded-xl border-2 border-[#252b3a] px-3 py-2 text-xs font-bold shadow-[2px_2px_0_0_#252b3a] cursor-pointer focus:outline-none transition-all ${
                  priorityFilter ? "bg-[#fff9e6] text-[#9a7300]" : "bg-white text-[#253044]"
                }`}
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Sort Control */}
            <div className="relative">
              <select
                aria-label="Sort Tasks"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as "newest" | "oldest" | "priority");
                  setPage(1);
                }}
                className="rounded-xl border-2 border-[#252b3a] bg-white px-3 py-2 text-xs font-bold text-[#253044] shadow-[2px_2px_0_0_#252b3a] cursor-pointer focus:outline-none"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="priority">Sort: By Priority</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 rounded-xl border-2 border-[#252b3a] bg-[#ffeef7] px-3 py-2 text-xs font-bold text-[#ff78c5] shadow-[2px_2px_0_0_#252b3a] hover:bg-[#ffdceb] active:translate-x-[0.5px] active:translate-y-[0.5px] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter count indicator */}
        <div className="mt-3 flex items-center justify-between pt-3 border-t-2 border-[#b8b6c5]/25 text-xs text-[#253044]/65">
          <span>
            Showing <strong className="text-[#253044]">{filteredTotal}</strong>{" "}
            {filteredTotal === 1 ? "task" : "tasks"}
            {hasActiveFilters && " (filtered)"}
          </span>
          {hasActiveFilters && (
            <span className="text-[11px] font-semibold text-[#6434df]">
              Filters active · Page {page} of {totalPages}
            </span>
          )}
        </div>
      </div>

      {/* 3. Task List Presentation */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[20px] border-[2.5px] border-[#ff78c5] bg-[#ffeef7] p-6 text-center shadow-[3px_3px_0_0_#252b3a]">
            <p className="text-sm font-bold text-[#253044]">
              Failed to load tasks from database.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-3 inline-flex items-center gap-1 px-4 py-2 rounded-xl border-2 border-[#252b3a] bg-white text-xs font-bold text-[#253044] shadow-[2px_2px_0_0_#252b3a]"
            >
              Retry Loading
            </button>
          </div>
        ) : totalTasksInDb === 0 ? (
          <EmptyState
            type="tasks"
            title="No tasks in your workspace yet"
            description="Your task pipeline is empty. Create your first task to start organizing deliverables, tracking status, and monitoring sprint progress."
            actionText="Create Your First Task"
            onAction={() => openCreateTask()}
          />
        ) : !data?.tasks || data.tasks.length === 0 ? (
          <EmptyState
            type="search"
            title="No matching tasks found"
            description="No tasks match your active search keyword or filter combination. Reset your filters to view all tasks in your workspace."
            actionText="Clear All Filters"
            onAction={clearFilters}
          />
        ) : (
          <div className="space-y-3">
            {data.tasks.map((task) => (
              <div
                key={task.id}
                className="group relative rounded-[20px] border-[2.5px] border-[#252b3a] bg-white p-4 sm:p-5 shadow-[3.5px_3.5px_0_0_#252b3a] hover:bg-[#fffdf5] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left task details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-base font-bold font-display text-[#253044] group-hover:text-[#6434df] transition-colors">
                        {task.title}
                      </h3>
                      <Badge value={task.priority} type="priority" />
                    </div>

                    {task.description && (
                      <p className="text-xs sm:text-sm text-[#253044]/75 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-[#253044]/55 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#253044]/45" />
                        Updated {formatDate(task.updatedAt)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Quick status toggle and actions */}
                  <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                    <TaskStatusDropdown
                      taskId={task.id}
                      currentStatus={task.status}
                    />

                    <div className="flex items-center gap-1 border-l-2 border-[#b8b6c5]/40 pl-2">
                      <button
                        type="button"
                        onClick={() => openEditTask(task)}
                        aria-label={`Edit ${task.title}`}
                        className="p-2 rounded-xl border-2 border-[#252b3a] bg-white text-[#253044] shadow-[1.5px_1.5px_0_0_#252b3a] hover:bg-[#f1ebff] hover:text-[#6434df] active:translate-x-[0.5px] active:translate-y-[0.5px] transition-all cursor-pointer"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openDeleteTask(task.id, task.title)}
                        aria-label={`Delete ${task.title}`}
                        className="p-2 rounded-xl border-2 border-[#252b3a] bg-white text-[#253044] shadow-[1.5px_1.5px_0_0_#252b3a] hover:bg-[#ffeef7] hover:text-[#ff78c5] active:translate-x-[0.5px] active:translate-y-[0.5px] transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 rounded-[18px] border-2 border-[#252b3a] bg-white shadow-[3px_3px_0_0_#252b3a]">
            <span className="text-xs font-semibold text-[#253044]/70">
              Page <strong className="text-[#253044]">{page}</strong> of{" "}
              <strong className="text-[#253044]">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 border-[#252b3a] bg-white text-xs font-bold text-[#253044] shadow-[1.5px_1.5px_0_0_#252b3a] hover:bg-[#fffdf5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 border-[#252b3a] bg-white text-xs font-bold text-[#253044] shadow-[1.5px_1.5px_0_0_#252b3a] hover:bg-[#fffdf5] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
