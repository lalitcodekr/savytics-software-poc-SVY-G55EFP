"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Status } from "@/types";
import { Circle, Clock, CheckCircle2, ChevronDown } from "lucide-react";

interface TaskStatusDropdownProps {
  taskId: string;
  currentStatus: Status;
}

export function TaskStatusDropdown({ taskId, currentStatus }: TaskStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Reposition dropdown on scroll / resize so it tracks the button
  useEffect(() => {
    if (!isOpen) return;
    const update = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + window.scrollY + 6,
          left: rect.left + window.scrollX,
        });
      }
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: (newStatus: Status) => api.tasks.update(taskId, { status: newStatus }),
    onSuccess: (_, newStatus) => {
      toast.success(`Status updated to ${newStatus === "TODO" ? "To Do" : newStatus === "IN_PROGRESS" ? "In Progress" : "Done"}`);
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const config: Record<Status, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
    TODO: {
      label: "To Do",
      icon: <Circle className="w-3 h-3 text-[#253044]" />,
      bg: "bg-[#fffdf5]",
      text: "text-[#253044]",
      border: "border-[#252b3a]",
    },
    IN_PROGRESS: {
      label: "In Progress",
      icon: <Clock className="w-3 h-3 text-[#6434df]" />,
      bg: "bg-[#f1ebff]",
      text: "text-[#6434df]",
      border: "border-[#6434df]",
    },
    DONE: {
      label: "Done",
      icon: <CheckCircle2 className="w-3 h-3 text-[#0a7544]" />,
      bg: "bg-[#e9fff5]",
      text: "text-[#0a7544]",
      border: "border-[#0a7544]",
    },
  };

  const current = config[currentStatus] || config.TODO;

  const handleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen((prev) => !prev);
  };

  const dropdownMenu = isOpen
    ? createPortal(
        <div
          ref={dropdownRef}
          style={{ position: "absolute", top: dropdownPos.top, left: dropdownPos.left }}
          className="w-36 rounded-xl border-2 border-[#252b3a] bg-white p-1 shadow-[3px_3px_0_0_#252b3a] z-[9999] animate-in fade-in zoom-in-95 duration-100"
        >
          {(["TODO", "IN_PROGRESS", "DONE"] as Status[]).map((status) => {
            const item = config[status];
            const isSelected = status === currentStatus;
            return (
              <button
                key={status}
                type="button"
                onClick={() => {
                  if (!isSelected) {
                    mutation.mutate(status);
                  } else {
                    setIsOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors text-left cursor-pointer ${
                  isSelected
                    ? "bg-[#f1ebff] text-[#6434df]"
                    : "text-[#253044] hover:bg-[#fffdf5]"
                }`}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#6434df]" />}
              </button>
            );
          })}
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        disabled={mutation.isPending}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border-[1.5px] shadow-[1.5px_1.5px_0_0_#252b3a] transition-all cursor-pointer ${current.bg} ${current.text} ${current.border} hover:opacity-90 active:translate-x-[0.5px] active:translate-y-[0.5px] disabled:opacity-50`}
      >
        {current.icon}
        <span>{current.label}</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {dropdownMenu}
    </div>
  );
}

