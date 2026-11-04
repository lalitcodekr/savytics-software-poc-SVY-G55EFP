"use client";

import React, { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskFormSchema, type TaskFormValues } from "@/schemas/task";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Task, Priority, Status } from "@/types";
import { X, Sparkles, Loader2, CheckCircle2, Circle, Clock } from "lucide-react";

interface TaskModalProps {
  task: Task | null;
  defaultStatus?: Status;
  onClose: () => void;
}

export function TaskModal({ task, defaultStatus = "TODO", onClose }: TaskModalProps) {
  const isEdit = !!task;
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "MEDIUM",
      status: task?.status ?? defaultStatus,
    },
  });

  const titleValue = useWatch({ control, name: "title" }) || "";
  const descValue = useWatch({ control, name: "description" }) || "";
  const currentPriority = useWatch({ control, name: "priority" }) || "MEDIUM";
  const currentStatus = useWatch({ control, name: "status" }) || defaultStatus;

  useEffect(() => {
    // Focus the title input on mount
    inputRef.current?.focus();

    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const mutation = useMutation({
    mutationFn: (data: TaskFormValues) =>
      isEdit ? api.tasks.update(task.id, data) : api.tasks.create(data),
    onSuccess: () => {
      toast.success(isEdit ? "Task updated successfully!" : "Task created successfully!");
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      onClose();
    },
    onError: (err: unknown) => {
      const apiErr = err as { error?: { message?: string } };
      const msg = apiErr?.error?.message || (isEdit ? "Failed to update task" : "Failed to create task");
      toast.error(msg);
    },
  });

  const onSubmit = (data: TaskFormValues) => {
    mutation.mutate(data);
  };

  const priorityOptions: { value: Priority; label: string; bg: string; activeColor: string }[] = [
    { value: "LOW", label: "Low", bg: "bg-[#e9fff5]", activeColor: "border-[#252b3a] bg-[#9bf1cd] text-[#253044]" },
    { value: "MEDIUM", label: "Medium", bg: "bg-[#fff9e6]", activeColor: "border-[#252b3a] bg-[#ffd05b] text-[#253044]" },
    { value: "HIGH", label: "High", bg: "bg-[#ffeef7]", activeColor: "border-[#252b3a] bg-[#ff78c5] text-[#253044]" },
  ];

  const statusOptions: { value: Status; label: string; icon: React.ReactNode }[] = [
    { value: "TODO", label: "To Do", icon: <Circle className="w-3.5 h-3.5" /> },
    { value: "IN_PROGRESS", label: "In Progress", icon: <Clock className="w-3.5 h-3.5" /> },
    { value: "DONE", label: "Done", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#253044]/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-[#ffffff] rounded-[24px] border-[3px] border-[#252b3a] shadow-[6px_6px_0_0_#252b3a] overflow-hidden">
        {/* Top playful geometric strip */}
        <div className="h-3 bg-[#6434df] flex items-center justify-between px-3">
          <div className="w-8 h-1.5 bg-[#ffd05b] rounded-full" />
          <div className="w-4 h-1.5 bg-[#ff78c5] rounded-full" />
          <div className="w-6 h-1.5 bg-[#9bf1cd] rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b-2 border-[#b8b6c5]/40 bg-[#fffdf5]">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#f1ebff] border-2 border-[#252b3a] text-[#6434df]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-title" className="text-xl font-bold font-display text-[#253044]">
                {isEdit ? "Edit Task" : "Create New Task"}
              </h2>
              <p className="text-xs text-[#253044]/70">
                {isEdit ? "Update task properties and progress" : "Add a new task to your Savytics workspace"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg border-2 border-[#252b3a] bg-white text-[#253044] hover:bg-[#ffeef7] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="task-title" className="text-xs font-bold uppercase tracking-wider text-[#253044]">
                Task Title <span className="text-[#6434df]">*</span>
              </label>
              <span className={`text-[11px] font-medium ${titleValue.length > 90 ? "text-[#ff78c5] font-bold" : "text-[#253044]/60"}`}>
                {titleValue.length}/100
              </span>
            </div>
            <input
              id="task-title"
              {...register("title")}
              ref={(e) => {
                register("title").ref(e);
                inputRef.current = e;
              }}
              placeholder="e.g., Implement PostgreSQL indexing"
              maxLength={100}
              className={`w-full px-3.5 py-2.5 rounded-xl border-[2.5px] bg-[#fffdf5] text-sm text-[#253044] font-medium placeholder-[#253044]/40 focus:outline-none transition-all ${
                errors.title
                  ? "border-[#ff78c5] bg-[#ffeef7] focus:ring-2 focus:ring-[#ff78c5]"
                  : "border-[#252b3a] focus:bg-white focus:shadow-[2px_2px_0_0_#6434df]"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs font-semibold text-[#ff78c5] flex items-center gap-1">
                ⚠️ {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="task-description" className="text-xs font-bold uppercase tracking-wider text-[#253044]">
                Description <span className="text-[#253044]/50 font-normal lowercase">(optional)</span>
              </label>
              <span className={`text-[11px] font-medium ${descValue.length > 900 ? "text-[#ff78c5] font-bold" : "text-[#253044]/60"}`}>
                {descValue.length}/1000
              </span>
            </div>
            <textarea
              id="task-description"
              {...register("description")}
              rows={3}
              placeholder="Add context, acceptance criteria, or technical notes..."
              maxLength={1000}
              className={`w-full px-3.5 py-2 rounded-xl border-[2.5px] bg-[#fffdf5] text-sm text-[#253044] placeholder-[#253044]/40 focus:outline-none transition-all resize-none ${
                errors.description
                  ? "border-[#ff78c5] bg-[#ffeef7] focus:ring-2 focus:ring-[#ff78c5]"
                  : "border-[#252b3a] focus:bg-white focus:shadow-[2px_2px_0_0_#6434df]"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs font-semibold text-[#ff78c5]">
                ⚠️ {errors.description.message}
              </p>
            )}
          </div>

          {/* Priority & Status Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#253044] mb-1.5">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {priorityOptions.map((opt) => {
                  const isSelected = currentPriority === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("priority", opt.value, { shouldValidate: true })}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? `${opt.activeColor} shadow-[2px_2px_0_0_#252b3a] translate-x-[-1px] translate-y-[-1px]`
                          : "border-[#b8b6c5] bg-white text-[#253044]/70 hover:border-[#252b3a]"
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#253044] mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {statusOptions.map((opt) => {
                  const isSelected = currentStatus === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setValue("status", opt.value, { shouldValidate: true })}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? "border-[#252b3a] bg-[#f1ebff] text-[#6434df] shadow-[2px_2px_0_0_#252b3a] translate-x-[-1px] translate-y-[-1px]"
                          : "border-[#b8b6c5] bg-white text-[#253044]/70 hover:border-[#252b3a]"
                      }`}
                    >
                      <span className="flex items-center gap-1">{opt.icon}</span>
                      <span className="text-[11px] leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-[#b8b6c5]/30">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-4 py-2 text-xs font-bold rounded-xl border-2 border-[#252b3a] bg-white text-[#253044] hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-5 py-2 text-xs font-bold rounded-xl border-2 border-[#252b3a] bg-[#6434df] text-white shadow-[3px_3px_0_0_#252b3a] hover:bg-[#5227c2] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
