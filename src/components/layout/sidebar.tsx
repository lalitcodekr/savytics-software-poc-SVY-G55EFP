"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Kanban,
  FileBarChart2,
  Layers,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      activeColor: "bg-[#f1ebff] text-[#6434df] border-[#252b3a]",
      indicatorColor: "bg-[#6434df]",
    },
    {
      name: "My Tasks",
      href: "/tasks",
      icon: CheckSquare,
      activeColor: "bg-[#e9fff5] text-[#253044] border-[#252b3a]",
      indicatorColor: "bg-[#9bf1cd]",
    },
    {
      name: "Kanban Board",
      href: "/board",
      icon: Kanban,
      activeColor: "bg-[#fff9e6] text-[#253044] border-[#252b3a]",
      indicatorColor: "bg-[#ffd05b]",
    },
    {
      name: "Project Overview",
      href: "/overview",
      icon: FileBarChart2,
      activeColor: "bg-[#ffeef7] text-[#253044] border-[#252b3a]",
      indicatorColor: "bg-[#ff78c5]",
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#253044]/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 md:w-68 bg-[#ffffff] border-r-[3px] border-[#252b3a] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand / Logo section */}
        <div className="p-5 border-b-[2.5px] border-[#252b3a] bg-[#fffdf5]">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            {/* Playful Geometric Logo Mark */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#6434df] border-2 border-[#252b3a] shadow-[2.5px_2.5px_0_0_#252b3a] group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform">
              <span className="text-white font-display font-extrabold text-xl tracking-tighter">S</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ffd05b] border border-[#252b3a]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-xl text-[#253044] tracking-tight">
                  Savytics
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold uppercase rounded bg-[#9bf1cd] border border-[#252b3a] text-[#253044]">
                  POC
                </span>
              </div>
              <p className="text-[11px] font-medium text-[#253044]/60">
                Project Tracker
              </p>
            </div>
          </Link>

          {/* Workspace selector tile */}
          <div className="mt-4 p-2.5 rounded-xl border-2 border-[#252b3a] bg-white shadow-[2px_2px_0_0_#252b3a] flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-5 h-5 rounded-md bg-[#f1ebff] border border-[#252b3a] flex items-center justify-center text-[#6434df] text-xs font-bold shrink-0">
                <Layers className="w-3 h-3" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-[#253044] truncate">Savytics POC</p>
                <p className="text-[10px] text-[#253044]/60 font-mono">SVY-G55EFP</p>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#9bf1cd] border border-[#252b3a]" />
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-[#253044]/50">
            Workspace Views
          </p>

          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all cursor-pointer ${
                  isActive
                    ? `${item.activeColor} shadow-[2.5px_2.5px_0_0_#252b3a] translate-x-[-1px] translate-y-[-1px]`
                    : "border-transparent text-[#253044]/75 hover:bg-[#fffdf5] hover:border-[#b8b6c5] hover:text-[#253044]"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-current" : "text-[#253044]/60"}`} />
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <div className={`w-2 h-2 rounded-full border border-[#252b3a] ${item.indicatorColor}`} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick project stats badge */}
        <div className="mx-3 mb-3 p-3 rounded-xl border-2 border-[#252b3a] bg-[#e9fff5] shadow-[2px_2px_0_0_#252b3a]">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#6434df]" />
            <span className="text-xs font-bold text-[#253044]">Sprint Health</span>
          </div>
          <p className="text-[11px] text-[#253044]/75 leading-tight">
            Database-synced active workspace on PostgreSQL.
          </p>
        </div>

        {/* Sidebar Footer: Profile placeholder & version */}
        <div className="p-3 border-t-[2.5px] border-[#252b3a] bg-[#fffdf5]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border-2 border-[#252b3a] shadow-[2px_2px_0_0_#252b3a]">
            {/* User Avatar */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#ffd05b] border-2 border-[#252b3a] text-xs font-bold text-[#253044] shrink-0">
              PK
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#9bf1cd] border border-[#252b3a]" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#253044] truncate">
                Pyda Lalit Kumar
              </p>
              <p className="text-[10px] text-[#253044]/60 truncate font-mono">
                SVY-G55EFP
              </p>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-[#253044]/50">
            <span>Savytics Suite</span>
            <span className="font-mono font-medium">v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
}
