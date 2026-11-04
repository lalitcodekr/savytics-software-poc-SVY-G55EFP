"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useTaskModal } from "@/context/task-modal-context";
import {
  ArrowRight,
  Plus,
  ShieldCheck,
} from "lucide-react";

export function OverviewView() {
  const { openCreateTask } = useTaskModal();

  const { data: summary } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.dashboard.summary,
  });

  const { data: tasksData } = useQuery({
    queryKey: ["tasks", { limit: 100 }],
    queryFn: () => api.tasks.list({ limit: 100 }),
  });

  const tasks = tasksData?.tasks ?? [];
  const total = summary?.total ?? 0;
  const todo = summary?.byStatus.TODO ?? 0;
  const inProgress = summary?.byStatus.IN_PROGRESS ?? 0;
  const done = summary?.byStatus.DONE ?? 0;
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

  // Calculate priority breakdown from real database records
  const highCount = tasks.filter((t) => t.priority === "HIGH").length;
  const mediumCount = tasks.filter((t) => t.priority === "MEDIUM").length;
  const lowCount = tasks.filter((t) => t.priority === "LOW").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Project Header / Hero Card */}
      <div className="relative overflow-hidden rounded-[24px] border-[3px] border-[#252b3a] bg-white p-6 sm:p-8 shadow-[5px_5px_0_0_#252b3a]">
        {/* Background playful accents */}
        <div className="pointer-events-none absolute -right-8 -top-8 w-36 h-36 rounded-full border-[3px] border-[#252b3a] bg-[#9bf1cd]/20" />
        <div className="pointer-events-none absolute bottom-0 right-16 w-12 h-12 rotate-12 border-2 border-[#252b3a] bg-[#ffd05b]/30 rounded-xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#252b3a] bg-[#f1ebff] text-[#6434df] text-xs font-bold shadow-[2px_2px_0_0_#252b3a] mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Savytics Assessment · SVY-G55EFP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#253044] tracking-tight">
              Savytics POC Project Overview
            </h1>
            <p className="mt-1 text-sm text-[#253044]/75 max-w-2xl leading-relaxed">
              Mini Project Tracker proof of concept. Tracks development roadmap, feature implementation, and sprint milestones with live PostgreSQL persistence.
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

        {/* Technical stack pills */}
        <div className="relative z-10 mt-6 pt-5 border-t-2 border-[#b8b6c5]/30 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#253044]/60 mr-1">Architecture:</span>
          {[
            "Next.js 16 App Router",
            "React 19",
            "TypeScript",
            "Prisma ORM",
            "PostgreSQL (Neon)",
            "TanStack React Query",
            "Tailwind CSS",
          ].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-lg border border-[#252b3a] bg-[#fffdf5] text-[11px] font-bold text-[#253044] shadow-[1px_1px_0_0_#252b3a]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Key Project Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[20px] border-[2.5px] border-[#252b3a] bg-white p-5 shadow-[4px_4px_0_0_#252b3a]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#253044]/60">
            Overall Completion
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-[#253044]">
              {completionRate}%
            </span>
          </div>
          <p className="mt-1 text-xs text-[#0a7544] font-semibold">
            {done} of {total} milestones done
          </p>
        </div>

        <div className="rounded-[20px] border-[2.5px] border-[#252b3a] bg-white p-5 shadow-[4px_4px_0_0_#252b3a]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#253044]/60">
            Total Deliverables
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-[#6434df]">
              {total}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#253044]/60">Active workspace tasks</p>
        </div>

        <div className="rounded-[20px] border-[2.5px] border-[#252b3a] bg-white p-5 shadow-[4px_4px_0_0_#252b3a]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#253044]/60">
            High Priority Tasks
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-[#ff78c5]">
              {highCount}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#253044]/60">Critical path focus</p>
        </div>

        <div className="rounded-[20px] border-[2.5px] border-[#252b3a] bg-white p-5 shadow-[4px_4px_0_0_#252b3a]">
          <p className="text-xs font-bold uppercase tracking-wider text-[#253044]/60">
            In Flight
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-4xl font-extrabold text-[#253044]">
              {inProgress}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#6434df] font-semibold">Active engineering</p>
        </div>
      </div>

      {/* 3. Deep Breakdowns (Priority vs Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="rounded-[24px] border-[3px] border-[#252b3a] bg-white p-6 shadow-[5px_5px_0_0_#252b3a]">
          <h2 className="text-base font-bold font-display text-[#253044] mb-1">
            Priority Distribution
          </h2>
          <p className="text-xs text-[#253044]/60 mb-5">
            Breakdown of tasks by urgency level
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-[#ff78c5]">HIGH PRIORITY</span>
                <span className="text-[#253044]">
                  {highCount} ({total > 0 ? Math.round((highCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full border-2 border-[#252b3a] bg-[#fffdf5] overflow-hidden p-0.5">
                <div
                  style={{ width: `${total > 0 ? (highCount / total) * 100 : 0}%` }}
                  className="h-full rounded-full bg-[#ff78c5] transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-[#9a7300]">MEDIUM PRIORITY</span>
                <span className="text-[#253044]">
                  {mediumCount} ({total > 0 ? Math.round((mediumCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full border-2 border-[#252b3a] bg-[#fffdf5] overflow-hidden p-0.5">
                <div
                  style={{ width: `${total > 0 ? (mediumCount / total) * 100 : 0}%` }}
                  className="h-full rounded-full bg-[#ffd05b] transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-[#0a7544]">LOW PRIORITY</span>
                <span className="text-[#253044]">
                  {lowCount} ({total > 0 ? Math.round((lowCount / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full border-2 border-[#252b3a] bg-[#fffdf5] overflow-hidden p-0.5">
                <div
                  style={{ width: `${total > 0 ? (lowCount / total) * 100 : 0}%` }}
                  className="h-full rounded-full bg-[#9bf1cd] transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="rounded-[24px] border-[3px] border-[#252b3a] bg-white p-6 shadow-[5px_5px_0_0_#252b3a]">
          <h2 className="text-base font-bold font-display text-[#253044] mb-1">
            Status Breakdown
          </h2>
          <p className="text-xs text-[#253044]/60 mb-5">
            Task distribution across the delivery lifecycle
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-[#0a7544]">DONE</span>
                <span className="text-[#253044]">
                  {done} ({total > 0 ? Math.round((done / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full border-2 border-[#252b3a] bg-[#fffdf5] overflow-hidden p-0.5">
                <div
                  style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
                  className="h-full rounded-full bg-[#9bf1cd] transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-[#6434df]">IN PROGRESS</span>
                <span className="text-[#253044]">
                  {inProgress} ({total > 0 ? Math.round((inProgress / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full border-2 border-[#252b3a] bg-[#fffdf5] overflow-hidden p-0.5">
                <div
                  style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }}
                  className="h-full rounded-full bg-[#6434df] transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="text-[#9a7300]">TO DO</span>
                <span className="text-[#253044]">
                  {todo} ({total > 0 ? Math.round((todo / total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full border-2 border-[#252b3a] bg-[#fffdf5] overflow-hidden p-0.5">
                <div
                  style={{ width: `${total > 0 ? (todo / total) * 100 : 0}%` }}
                  className="h-full rounded-full bg-[#ffd05b] transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Quick Action Shortcuts */}
      <div className="p-6 rounded-[24px] border-[3px] border-[#252b3a] bg-[#fffdf5] shadow-[5px_5px_0_0_#252b3a]">
        <h2 className="text-base font-bold font-display text-[#253044] mb-3">
          Quick Navigation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/tasks"
            className="geo-interactive flex items-center justify-between p-3.5 rounded-xl border-2 border-[#252b3a] bg-white shadow-[2px_2px_0_0_#252b3a] hover:bg-[#f1ebff] hover:text-[#6434df] text-sm font-bold transition-all"
          >
            <span>Open Task List</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/board"
            className="geo-interactive flex items-center justify-between p-3.5 rounded-xl border-2 border-[#252b3a] bg-white shadow-[2px_2px_0_0_#252b3a] hover:bg-[#fff9e6] hover:text-[#253044] text-sm font-bold transition-all"
          >
            <span>Open Kanban Board</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => openCreateTask()}
            className="geo-interactive flex items-center justify-between p-3.5 rounded-xl border-2 border-[#252b3a] bg-[#6434df] text-white shadow-[2px_2px_0_0_#252b3a] hover:bg-[#5227c2] text-sm font-bold transition-all cursor-pointer text-left"
          >
            <span>Create New Task</span>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
