"use client";

import React, { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Trash2, X, Loader2 } from "lucide-react";

interface DeleteDialogProps {
  taskId: string;
  taskTitle?: string;
  onClose: () => void;
}

export function DeleteDialog({ taskId, taskTitle, onClose }: DeleteDialogProps) {
  const qc = useQueryClient();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const deleteMutation = useMutation({
    mutationFn: () => api.tasks.delete(taskId),
    onSuccess: () => {
      toast.success("Task deleted successfully");
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#253044]/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-[24px] border-[3px] border-[#252b3a] shadow-[6px_6px_0_0_#252b3a] overflow-hidden">
        {/* Pink warning strip */}
        <div className="h-3 bg-[#ff78c5] flex items-center justify-between px-3">
          <div className="w-6 h-1.5 bg-[#253044] rounded-full" />
          <div className="w-12 h-1.5 bg-white rounded-full" />
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ffeef7] border-[2.5px] border-[#252b3a] text-[#ff78c5] shrink-0 shadow-[2px_2px_0_0_#252b3a]">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h3 id="delete-dialog-title" className="text-lg font-bold font-display text-[#253044]">
                Delete Task?
              </h3>
              <p id="delete-dialog-desc" className="text-sm text-[#253044]/75 mt-1 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <strong className="text-[#253044] font-bold">
                  &ldquo;{taskTitle || "this task"}&rdquo;
                </strong>
                ? This action removes the task from the database and cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cancel"
              className="p-1 rounded-lg text-[#253044]/60 hover:text-[#253044] hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t-2 border-[#b8b6c5]/30">
            <button
              type="button"
              onClick={onClose}
              disabled={deleteMutation.isPending}
              className="px-4 py-2 text-xs font-bold rounded-xl border-2 border-[#252b3a] bg-white text-[#253044] hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Keep Task
            </button>
            <button
              type="button"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="px-5 py-2 text-xs font-bold rounded-xl border-2 border-[#252b3a] bg-[#ff78c5] text-[#253044] shadow-[3px_3px_0_0_#252b3a] hover:bg-[#ff61b9] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Yes, Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
