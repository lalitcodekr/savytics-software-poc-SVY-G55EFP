"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TaskModalProvider } from "@/context/task-modal-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <TaskModalProvider>
      <div className="min-h-screen bg-[#fffdf5] text-[#253044] flex">
        {/* Left Persistent Sidebar */}
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Right Main Application Area */}
        <div className="flex-1 flex flex-col min-w-0 md:pl-68">
          <Topbar onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </TaskModalProvider>
  );
}

