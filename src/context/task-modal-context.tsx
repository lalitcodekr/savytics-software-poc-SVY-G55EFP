"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Task } from "@/types";
import { TaskModal } from "@/components/tasks/task-modal";
import { DeleteDialog } from "@/components/tasks/delete-dialog";

interface TaskModalContextType {
  openCreateTask: (defaultStatus?: "TODO" | "IN_PROGRESS" | "DONE") => void;
  openEditTask: (task: Task) => void;
  openDeleteTask: (id: string, title?: string) => void;
  closeAll: () => void;
  globalSearch: string;
  setGlobalSearch: (search: string) => void;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export function TaskModalProvider({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    task: Task | null;
    defaultStatus?: "TODO" | "IN_PROGRESS" | "DONE";
  }>({
    isOpen: false,
    task: null,
  });

  const [deleteState, setDeleteState] = useState<{
    isOpen: boolean;
    taskId: string | null;
    taskTitle?: string;
  }>({
    isOpen: false,
    taskId: null,
  });

  const [globalSearch, setGlobalSearch] = useState("");

  const openCreateTask = useCallback((defaultStatus?: "TODO" | "IN_PROGRESS" | "DONE") => {
    setModalState({ isOpen: true, task: null, defaultStatus });
  }, []);

  const openEditTask = useCallback((task: Task) => {
    setModalState({ isOpen: true, task });
  }, []);

  const openDeleteTask = useCallback((id: string, title?: string) => {
    setDeleteState({ isOpen: true, taskId: id, taskTitle: title });
  }, []);

  const closeAll = useCallback(() => {
    setModalState({ isOpen: false, task: null });
    setDeleteState({ isOpen: false, taskId: null });
  }, []);

  return (
    <TaskModalContext.Provider
      value={{
        openCreateTask,
        openEditTask,
        openDeleteTask,
        closeAll,
        globalSearch,
        setGlobalSearch,
      }}
    >
      {children}
      {modalState.isOpen && (
        <TaskModal
          task={modalState.task}
          defaultStatus={modalState.defaultStatus}
          onClose={() => setModalState({ isOpen: false, task: null })}
        />
      )}
      {deleteState.isOpen && deleteState.taskId && (
        <DeleteDialog
          taskId={deleteState.taskId}
          taskTitle={deleteState.taskTitle}
          onClose={() => setDeleteState({ isOpen: false, taskId: null })}
        />
      )}
    </TaskModalContext.Provider>
  );
}

export function useTaskModal() {
  const context = useContext(TaskModalContext);
  if (!context) {
    throw new Error("useTaskModal must be used within a TaskModalProvider");
  }
  return context;
}

