"use client";

import React from "react";
import { Plus, Search, Sparkles } from "lucide-react";

interface EmptyStateProps {
  type?: "dashboard" | "tasks" | "search" | "board";
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  type = "tasks",
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}: EmptyStateProps) {
  const isSearch = type === "search";

  const defaultTitle = isSearch
    ? "No matching tasks found"
    : type === "dashboard"
    ? "Your workspace is ready"
    : type === "board"
    ? "No tasks on this board"
    : "Your task list is empty";

  const defaultDescription = isSearch
    ? "We couldn't find any tasks matching your active filters or search keyword. Try clearing them to see all tasks."
    : type === "dashboard"
    ? "Start tracking your project progress by creating your first task. Your workspace statistics and progress breakdown will appear right here."
    : type === "board"
    ? "There are currently no tasks in your project pipeline. Create a task to populate your workflow board."
    : "Create your very first task to kick off your project tracking and watch your workspace statistics update dynamically.";

  const defaultActionText = isSearch ? "Clear All Filters" : "Create Your First Task";

  return (
    <div className="relative overflow-hidden rounded-[24px] border-[3px] border-[#252b3a] bg-[#ffffff] p-8 sm:p-12 text-center shadow-[5px_5px_0_0_#252b3a]">
      {/* Decorative geometric background elements */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full border-[3px] border-[#252b3a] bg-[#ffd05b]/20" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rotate-12 border-[3px] border-[#252b3a] bg-[#ff78c5]/15 rounded-2xl" />
      <div className="pointer-events-none absolute top-1/2 left-8 -translate-y-1/2 w-4 h-4 rounded-full bg-[#6434df]" />
      <div className="pointer-events-none absolute top-8 right-24 w-3 h-3 rotate-45 bg-[#9bf1cd] border border-[#252b3a]" />

      {/* Center geometric illustration composition */}
      <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
        {/* Violet offset base layer */}
        <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-[22px] bg-[#6434df] border-[2.5px] border-[#252b3a]" />
        {/* White surface card */}
        <div className="relative flex h-full w-full items-center justify-center rounded-[22px] border-[2.5px] border-[#252b3a] bg-[#fffdf5]">
          {isSearch ? (
            <div className="relative flex items-center justify-center">
              <Search className="h-10 w-10 text-[#6434df]" />
              <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#252b3a] bg-[#ff78c5]" />
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-[#6434df]" />
              <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#252b3a] bg-[#ffd05b]" />
            </div>
          )}
        </div>
      </div>

      {/* Headings and text */}
      <h3 className="text-xl sm:text-2xl font-bold font-display text-[#253044] tracking-tight">
        {title || defaultTitle}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#253044]/75 leading-relaxed">
        {description || defaultDescription}
      </p>

      {/* Action buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="geo-interactive inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#252b3a] bg-[#6434df] px-5 py-2.5 text-sm font-bold text-white shadow-[3px_3px_0_0_#252b3a] hover:bg-[#5227c2] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{actionText || defaultActionText}</span>
          </button>
        )}
        {secondaryActionText && onSecondaryAction && (
          <button
            type="button"
            onClick={onSecondaryAction}
            className="geo-interactive inline-flex items-center gap-2 rounded-xl border-[2.5px] border-[#252b3a] bg-white px-4 py-2.5 text-sm font-bold text-[#253044] shadow-[3px_3px_0_0_#252b3a] hover:bg-[#fffdf5] cursor-pointer"
          >
            <span>{secondaryActionText}</span>
          </button>
        )}
      </div>
    </div>
  );
}

