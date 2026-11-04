"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Plus, Search, ChevronRight } from "lucide-react";
import { useTaskModal } from "@/context/task-modal-context";

interface TopbarProps {
  onOpenMobileSidebar: () => void;
}

export function Topbar({ onOpenMobileSidebar }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { openCreateTask, globalSearch, setGlobalSearch } = useTaskModal();

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard";
      case "/tasks":
        return "My Tasks";
      case "/board":
        return "Kanban Board";
      case "/overview":
        return "Project Overview";
      default:
        return "Workspace";
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && pathname !== "/tasks") {
      router.push("/tasks");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b-[2.5px] border-[#252b3a] bg-[#fffdf5]/95 px-4 backdrop-blur-xs sm:px-6 md:px-8">
      {/* Left: Hamburger (mobile) & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open sidebar menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[#252b3a] bg-white text-[#253044] shadow-[2px_2px_0_0_#252b3a] md:hidden cursor-pointer active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb trail */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#253044]/60">
          <span className="hidden sm:inline-block">Savytics POC</span>
          <ChevronRight className="hidden sm:inline-block h-3.5 w-3.5 text-[#253044]/40" />
          <span className="text-sm sm:text-base font-bold font-display text-[#253044]">
            {getPageTitle()}
          </span>
        </div>
      </div>

      {/* Right: Search, DB sync indicator, and New Task button */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick search input (compact) */}
        <div className="relative hidden lg:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#253044]/50" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search tasks... (Press Enter)"
            className="w-full rounded-xl border-2 border-[#252b3a] bg-white py-1.5 pl-8 pr-3 text-xs font-medium text-[#253044] placeholder-[#253044]/40 shadow-[2px_2px_0_0_#252b3a] focus:bg-[#fffdf5] focus:outline-none focus:ring-1 focus:ring-[#6434df]"
          />
        </div>

        {/* Database status pill */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border-2 border-[#252b3a] bg-white px-2.5 py-1 text-[11px] font-bold text-[#253044] shadow-[2px_2px_0_0_#252b3a]">
          <span className="h-2 w-2 rounded-full bg-[#9bf1cd] border border-[#252b3a] animate-pulse" />
          <span>PostgreSQL Live</span>
        </div>

        {/* Primary + New Task Button */}
        <button
          type="button"
          onClick={() => openCreateTask()}
          className="geo-interactive flex items-center gap-1.5 rounded-xl border-[2.5px] border-[#252b3a] bg-[#6434df] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-[3px_3px_0_0_#252b3a] hover:bg-[#5227c2] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
