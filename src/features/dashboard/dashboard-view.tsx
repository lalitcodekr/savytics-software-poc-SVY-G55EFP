"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useTaskModal } from "@/context/task-modal-context";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TaskStatusDropdown } from "@/components/tasks/task-status-dropdown";
import { EmptyState } from "@/components/common/empty-state";
import {
  Plus,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Layers,
  Sparkles,
  TrendingUp,
  Pencil,
  Trash2,
} from "lucide-react";

export function DashboardView() {
  const { openCreateTask, openEditTask, openDeleteTask } = useTaskModal();

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.dashboard.summary,
  });

  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isError: isTasksError,
  } = useQuery({
    queryKey: ["tasks", { limit: 5, sort: "newest" }],
    queryFn: () => api.tasks.list({ limit: 5, sort: "newest" }),
  });

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const total = summary?.total ?? 0;
  const todo = summary?.byStatus.TODO ?? 0;
  const inProgress = summary?.byStatus.IN_PROGRESS ?? 0;
  const done = summary?.byStatus.DONE ?? 0;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
  const remaining = total - done;

  const statCards = [
    {
      label: "Total Tasks",
      value: total,
      sublabel: "Active pipeline",
      icon: <Layers className="w-5 h-5 text-[#6434df]" />,
      accentBg: "bg-[#f1ebff]",
      accentBorder: "border-[#6434df]",
      textColor: "text-[#6434df]",
      badgeText: "Workspace Total",
      pillBg: "bg-[#f1ebff] text-[#6434df]",
    },
    {
      label: "To Do",
      value: todo,
      sublabel: "Pending initiation",
      icon: <Circle className="w-5 h-5 text-[#9a7300]" />,
      accentBg: "bg-[#fff9e6]",
      accentBorder: "border-[#ffd05b]",
      textColor: "text-[#9a7300]",
      badgeText: "Awaiting Start",
      pillBg: "bg-[#fff9e6] text-[#9a7300]",
    },
    {
      label: "In Progress",
      value: inProgress,
      sublabel: "Work underway",
      icon: <Clock className="w-5 h-5 text-[#6434df]" />,
      accentBg: "bg-[#f1ebff]",
      accentBorder: "border-[#6434df]",
      textColor: "text-[#6434df]",
      badgeText: "Active Sprints",
      pillBg: "bg-[#f1ebff] text-[#6434df]",
    },
    {
      label: "Done",
      value: done,
      sublabel: "Completed milestones",
      icon: <CheckCircle2 className="w-5 h-5 text-[#0a7544]" />,
      accentBg: "bg-[#e9fff5]",
      accentBorder: "border-[#9bf1cd]",
      textColor: "text-[#0a7544]",
      badgeText: "Finished",
      pillBg: "bg-[#e9fff5] text-[#0a7544]",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Section */}
      <section className="relative overflow-hidden rounded-[24px] border-[3px] border-[#252b3a] bg-white p-6 sm:p-8 shadow-[5px_5px_0_0_#252b3a]">
        {/* Playful Geometric shape cluster in top-right */}
        <div className="pointer-events-none absolute -right-6 -top-6 flex items-center gap-2 opacity-80 sm:opacity-100">
          <div className="w-16 h-16 rounded-full border-[3px] border-[#252b3a] bg-[#ffd05b]/30" />
          <div className="w-12 h-20 -rotate-12 rounded-t-full border-[3px] border-[#252b3a] bg-[#9bf1cd]/40" />
          <div className="w-14 h-14 rotate-45 border-[3px] border-[#252b3a] bg-[#ff78c5]/25" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#252b3a] bg-[#f1ebff] text-[#6434df] text-xs font-bold shadow-[2px_2px_0_0_#252b3a] mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getGreeting()}, Lalit</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#253044] tracking-tight">
              Your workspace
            </h1>
            <p className="mt-1 text-sm text-[#253044]/75 max-w-xl leading-relaxed">
              Real-time summary of tasks, progress metrics, and team workflow for{" "}
              <strong className="text-[#253044] font-semibold">Savytics POC</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => openCreateTask()}
              className="geo-interactive flex items-center gap-2 rounded-xl border-[2.5px] border-[#252b3a] bg-[#6434df] px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-bold text-white shadow-[3px_3px_0_0_#252b3a] hover:bg-[#5227c2] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section (Fact Strip) */}
      <section aria-label="Project statistics">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#253044]/60">
            Project Overview Metrics
          </h2>
          <span className="text-xs font-medium text-[#253044]/50">Live database counts</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="relative overflow-hidden rounded-[20px] border-[2.5px] border-[#252b3a] bg-white p-4 sm:p-5 shadow-[4px_4px_0_0_#252b3a] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform flex flex-col justify-between"
            >
              {/* Top Accent Strip */}
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#252b3a] ${card.accentBg} shadow-[2px_2px_0_0_#252b3a]`}
                >
                  {card.icon}
                </div>
                <span
                  className={`rounded-full border border-[#252b3a] px-2 py-0.5 text-[10px] font-bold ${card.pillBg}`}
                >
                  {card.badgeText}
                </span>
              </div>

              {/* Value & Label */}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl sm:text-4xl font-extrabold text-[#253044]">
                    {isSummaryLoading ? "–" : card.value}
                  </span>
                </div>
                <p className="mt-1 text-sm font-bold text-[#253044]">{card.label}</p>
                <p className="text-xs text-[#253044]/60">{card.sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Progress Visualization & Completion Breakdown */}
      {total === 0 ? (
        <EmptyState
          type="dashboard"
          title="Your workspace is clear & ready"
          description="There are currently zero tasks in the database. Create your first task to kickstart your project workflow and monitor completion statistics in real time."
          actionText="Create Your First Task"
          onAction={() => openCreateTask()}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Overview Panel */}
          <div className="lg:col-span-1 rounded-[24px] border-[3px] border-[#252b3a] bg-white p-6 shadow-[5px_5px_0_0_#252b3a] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#9bf1cd] border-2 border-[#252b3a] flex items-center justify-center text-[#253044]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-display text-[#253044]">
                      Completion Rate
                    </h3>
                    <p className="text-xs text-[#253044]/60">Overall delivery progress</p>
                  </div>
                </div>
                <span className="text-xs font-bold font-mono px-2 py-1 rounded-md bg-[#e9fff5] border border-[#252b3a] text-[#0a7544]">
                  {completionRate}% DONE
                </span>
              </div>

              {/* Giant percentage display */}
              <div className="my-5 flex items-baseline gap-2">
                <span className="font-display text-5xl font-extrabold text-[#253044]">
                  {completionRate}%
                </span>
                <span className="text-xs text-[#253044]/60 font-semibold">
                  ({done} of {total} completed)
                </span>
              </div>

              {/* Stacked geometric progress bar */}
              <div className="w-full h-5 rounded-full border-2 border-[#252b3a] bg-[#fffdf5] overflow-hidden flex p-0.5 gap-0.5 shadow-[1.5px_1.5px_0_0_#252b3a]">
                {done > 0 && (
                  <div
                    style={{ width: `${(done / total) * 100}%` }}
                    className="h-full bg-[#9bf1cd] rounded-l-full transition-all duration-500"
                    title={`Done: ${done}`}
                  />
                )}
                {inProgress > 0 && (
                  <div
                    style={{ width: `${(inProgress / total) * 100}%` }}
                    className="h-full bg-[#6434df] transition-all duration-500"
                    title={`In Progress: ${inProgress}`}
                  />
                )}
                {todo > 0 && (
                  <div
                    style={{ width: `${(todo / total) * 100}%` }}
                    className="h-full bg-[#ffd05b] rounded-r-full transition-all duration-500"
                    title={`To Do: ${todo}`}
                  />
                )}
              </div>

              {/* Status Breakdown Legend */}
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#9bf1cd] border border-[#252b3a]" />
                    <span className="text-[#253044]">Completed</span>
                  </div>
                  <span className="font-bold text-[#253044]">{done} tasks</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#6434df] border border-[#252b3a]" />
                    <span className="text-[#253044]">In Progress</span>
                  </div>
                  <span className="font-bold text-[#253044]">{inProgress} tasks</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ffd05b] border border-[#252b3a]" />
                    <span className="text-[#253044]">To Do</span>
                  </div>
                  <span className="font-bold text-[#253044]">{todo} tasks</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#b8b6c5]/30 flex items-center justify-between text-xs text-[#253044]/75">
              <span>Remaining workload:</span>
              <span className="font-bold text-[#253044]">{remaining} tasks</span>
            </div>
          </div>

          {/* Recent Tasks List */}
          <div className="lg:col-span-2 rounded-[24px] border-[3px] border-[#252b3a] bg-white p-6 shadow-[5px_5px_0_0_#252b3a] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold font-display text-[#253044]">
                    Recently Updated Tasks
                  </h3>
                  <p className="text-xs text-[#253044]/60">
                    Latest activity from your project pipeline
                  </p>
                </div>
                <Link
                  href="/tasks"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6434df] hover:underline cursor-pointer"
                >
                  <span>View All Tasks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {isTasksLoading ? (
                <div className="space-y-3 py-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 rounded-xl border-2 border-[#b8b6c5]/40 bg-gray-50 animate-pulse"
                    />
                  ))}
                </div>
              ) : isTasksError ? (
                <div className="p-4 rounded-xl border-2 border-[#ff78c5] bg-[#ffeef7] text-xs text-[#253044]">
                  Failed to load recent tasks.
                </div>
              ) : !tasksData?.tasks || tasksData.tasks.length === 0 ? (
                <div className="py-8 text-center text-sm text-[#253044]/60">
                  No tasks recorded yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {tasksData.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border-2 border-[#252b3a] bg-[#fffdf5] shadow-[2.5px_2.5px_0_0_#252b3a] hover:bg-[#ffffff] transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#253044] truncate">
                            {task.title}
                          </h4>
                          <Badge value={task.priority} type="priority" />
                        </div>
                        {task.description && (
                          <p className="mt-1 text-xs text-[#253044]/70 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[#253044]/55">
                          <span>Updated {formatDate(task.updatedAt)}</span>
                        </div>
                      </div>

                      {/* Right quick actions & status dropdown */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <TaskStatusDropdown
                          taskId={task.id}
                          currentStatus={task.status}
                        />

                        <button
                          type="button"
                          onClick={() => openEditTask(task)}
                          aria-label={`Edit ${task.title}`}
                          className="p-1.5 rounded-lg border border-[#252b3a] bg-white text-[#253044] hover:bg-[#f1ebff] hover:text-[#6434df] transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openDeleteTask(task.id, task.title)}
                          aria-label={`Delete ${task.title}`}
                          className="p-1.5 rounded-lg border border-[#252b3a] bg-white text-[#253044] hover:bg-[#ffeef7] hover:text-[#ff78c5] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t-2 border-[#b8b6c5]/30 flex items-center justify-between text-xs text-[#253044]/60">
              <span>Showing up to 5 most recent tasks</span>
              <Link
                href="/tasks"
                className="font-bold text-[#6434df] hover:underline"
              >
                Go to My Tasks →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
