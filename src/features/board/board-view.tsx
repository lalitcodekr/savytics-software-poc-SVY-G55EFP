"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useTaskModal } from "@/context/task-modal-context";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/empty-state";
import type { Status } from "@/types";
import { toast } from "sonner";
import {
  Kanban,
  Plus,
  Circle,
  Clock,
  CheckCircle2,
  Pencil,
  Trash2,
  ArrowRight,
  ArrowLeft,
  GripVertical,
} from "lucide-react";

export function BoardView() {
  const qc = useQueryClient();
  const { openCreateTask, openEditTask, openDeleteTask } = useTaskModal();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<Status | null>(null);

  // Fetch all tasks for the board
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["tasks", { limit: 100 }],
    queryFn: () => api.tasks.list({ limit: 100 }),
  });

  const tasks = data?.tasks ?? [];

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      api.tasks.update(id, { status }),
    onSuccess: (_, variables) => {
      const label =
        variables.status === "TODO"
          ? "To Do"
          : variables.status === "IN_PROGRESS"
          ? "In Progress"
          : "Done";
      toast.success(`Task moved to ${label}`);
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: () => {
      toast.error("Failed to move task. Reverting.");
    },
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: Status) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Status) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData("text/plain") || draggedTaskId;
    setDraggedTaskId(null);

    if (!taskId) return;
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== targetStatus) {
      updateStatusMutation.mutate({ id: taskId, status: targetStatus });
    }
  };

  const columns: {
    id: Status;
    title: string;
    description: string;
    accentBg: string;
    accentBorder: string;
    headerBg: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "TODO",
      title: "TO DO",
      description: "Backlog items awaiting initiation",
      accentBg: "bg-[#fff9e6]",
      accentBorder: "border-[#ffd05b]",
      headerBg: "bg-[#ffd05b]/20",
      icon: <Circle className="w-4 h-4 text-[#9a7300]" />,
    },
    {
      id: "IN_PROGRESS",
      title: "IN PROGRESS",
      description: "Active deliverables currently in progress",
      accentBg: "bg-[#f1ebff]",
      accentBorder: "border-[#6434df]",
      headerBg: "bg-[#6434df]/15",
      icon: <Clock className="w-4 h-4 text-[#6434df]" />,
    },
    {
      id: "DONE",
      title: "DONE",
      description: "Completed and verified tasks",
      accentBg: "bg-[#e9fff5]",
      accentBorder: "border-[#9bf1cd]",
      headerBg: "bg-[#9bf1cd]/30",
      icon: <CheckCircle2 className="w-4 h-4 text-[#0a7544]" />,
    },
  ];

  const getTasksByStatus = (status: Status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-[24px] border-[3px] border-[#252b3a] bg-white shadow-[5px_5px_0_0_#252b3a]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-[#252b3a] bg-[#fff9e6] text-[#253044] text-xs font-bold shadow-[2px_2px_0_0_#252b3a] mb-2">
            <Kanban className="w-3.5 h-3.5 text-[#6434df]" />
            <span>Interactive Workflow</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#253044] tracking-tight">
              Kanban Board
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border-2 border-[#252b3a] bg-[#f1ebff] text-xs font-bold text-[#6434df] shadow-[1.5px_1.5px_0_0_#252b3a]">
              {tasks.length} total
            </span>
          </div>
          <p className="mt-1 text-sm text-[#253044]/75 max-w-xl">
            Drag cards between columns or use quick action controls to update task status in real time.
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

      {/* 2. Board Grid or Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-96 rounded-[22px] border-[2.5px] border-[#b8b6c5]/40 bg-white/60 animate-pulse p-4"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="p-6 rounded-[20px] border-[2.5px] border-[#ff78c5] bg-[#ffeef7] text-center">
          <p className="text-sm font-bold text-[#253044]">Failed to load board tasks.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 rounded-xl border-2 border-[#252b3a] bg-white text-xs font-bold"
          >
            Retry
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          type="board"
          title="Board is ready for tasks"
          description="Your Kanban board reflects all database tasks across To Do, In Progress, and Done. Add your first task to see cards in motion."
          actionText="Create Your First Task"
          onAction={() => openCreateTask()}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {columns.map((col) => {
            const columnTasks = getTasksByStatus(col.id);
            const isColumnDragOver = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`rounded-[24px] border-[3px] border-[#252b3a] bg-white shadow-[4px_4px_0_0_#252b3a] flex flex-col transition-all min-h-[500px] ${
                  isColumnDragOver
                    ? "ring-4 ring-[#6434df] ring-offset-2 bg-[#f1ebff]/40"
                    : ""
                }`}
              >
                {/* Column Header */}
                <div
                  className={`p-4 border-b-2 border-[#252b3a] rounded-t-[21px] flex items-center justify-between ${col.headerBg}`}
                >
                  <div className="flex items-center gap-2">
                    {col.icon}
                    <h2 className="text-sm font-extrabold font-display text-[#253044] tracking-wider">
                      {col.title}
                    </h2>
                    <span className="ml-1 px-2 py-0.5 rounded-full border border-[#252b3a] bg-white text-xs font-bold text-[#253044] shadow-[1px_1px_0_0_#252b3a]">
                      {columnTasks.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openCreateTask(col.id)}
                    aria-label={`Add task in ${col.title}`}
                    className="p-1 rounded-lg border border-[#252b3a] bg-white text-[#253044] hover:bg-[#fffdf5] shadow-[1px_1px_0_0_#252b3a] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Column Body / Cards */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="py-12 px-4 text-center rounded-xl border-2 border-dashed border-[#b8b6c5] bg-[#fffdf5]/50">
                      <p className="text-xs font-semibold text-[#253044]/50">
                        Drop cards here or click + to add a task
                      </p>
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const isDragging = draggedTaskId === task.id;

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          className={`group rounded-[18px] border-2 border-[#252b3a] bg-[#fffdf5] p-3.5 shadow-[2.5px_2.5px_0_0_#252b3a] hover:bg-white hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all cursor-grab active:cursor-grabbing ${
                            isDragging ? "opacity-40 scale-95" : ""
                          }`}
                        >
                          {/* Card Header: Drag grip & Priority */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5 text-[#253044]/40">
                              <GripVertical className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                              <Badge value={task.priority} type="priority" />
                            </div>

                            {/* Card Edit/Delete Action Buttons */}
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => openEditTask(task)}
                                aria-label={`Edit ${task.title}`}
                                className="p-1 rounded-md border border-[#252b3a] bg-white text-[#253044] hover:bg-[#f1ebff] hover:text-[#6434df] transition-colors"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openDeleteTask(task.id, task.title)}
                                aria-label={`Delete ${task.title}`}
                                className="p-1 rounded-md border border-[#252b3a] bg-white text-[#253044] hover:bg-[#ffeef7] hover:text-[#ff78c5] transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Title & Description */}
                          <h3 className="text-sm font-bold text-[#253044] leading-snug">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="mt-1 text-xs text-[#253044]/70 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Footer: Date & Quick Status Shift buttons */}
                          <div className="mt-3 pt-2.5 border-t border-[#b8b6c5]/30 flex items-center justify-between text-[11px] text-[#253044]/55">
                            <span>{formatDate(task.updatedAt)}</span>

                            {/* Quick status movement controls */}
                            <div className="flex items-center gap-1">
                              {task.status !== "TODO" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      id: task.id,
                                      status: task.status === "DONE" ? "IN_PROGRESS" : "TODO",
                                    })
                                  }
                                  title={`Move to ${task.status === "DONE" ? "In Progress" : "To Do"}`}
                                  className="p-1 rounded bg-white border border-[#252b3a] text-[#253044] hover:bg-[#f1ebff] cursor-pointer"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}

                              {task.status !== "DONE" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateStatusMutation.mutate({
                                      id: task.id,
                                      status: task.status === "TODO" ? "IN_PROGRESS" : "DONE",
                                    })
                                  }
                                  title={`Move to ${task.status === "TODO" ? "In Progress" : "Done"}`}
                                  className="p-1 rounded bg-white border border-[#252b3a] text-[#253044] hover:bg-[#e9fff5] cursor-pointer"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
