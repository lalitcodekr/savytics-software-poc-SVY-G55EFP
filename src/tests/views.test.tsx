import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TaskModalProvider } from "@/context/task-modal-context";
import { DashboardView } from "@/features/dashboard/dashboard-view";
import { TasksView } from "@/features/tasks/tasks-view";
import { BoardView } from "@/features/board/board-view";
import { OverviewView } from "@/features/overview/overview-view";
import { api } from "@/lib/api";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock API
vi.mock("@/lib/api", () => ({
  api: {
    dashboard: {
      summary: vi.fn(),
    },
    tasks: {
      list: vi.fn(),
      get: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <TaskModalProvider>{ui}</TaskModalProvider>
    </QueryClientProvider>
  );
}

describe("Playful Geometric Multi-Page Views", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("DashboardView", () => {
    it("renders dynamic 0 counts and empty state when database has zero tasks", async () => {
      vi.mocked(api.dashboard.summary).mockResolvedValue({
        total: 0,
        byStatus: { TODO: 0, IN_PROGRESS: 0, DONE: 0 },
      });
      vi.mocked(api.tasks.list).mockResolvedValue({
        tasks: [],
        pagination: { total: 0, page: 1, limit: 5, totalPages: 0 },
      });

      renderWithProviders(<DashboardView />);

      expect(screen.getByText("Your workspace")).toBeInTheDocument();
      expect(screen.getByText("Total Tasks")).toBeInTheDocument();
      expect(screen.getByText("To Do")).toBeInTheDocument();
      expect(screen.getByText("In Progress")).toBeInTheDocument();
      expect(screen.getByText("Done")).toBeInTheDocument();

      // Empty state should be rendered
      const emptyHeading = await screen.findByText("Your workspace is clear & ready");
      expect(emptyHeading).toBeInTheDocument();
      expect(screen.getByText("Create Your First Task")).toBeInTheDocument();
    });

    it("renders progress rate and recent tasks when tasks exist", async () => {
      vi.mocked(api.dashboard.summary).mockResolvedValue({
        total: 2,
        byStatus: { TODO: 1, IN_PROGRESS: 0, DONE: 1 },
      });
      vi.mocked(api.tasks.list).mockResolvedValue({
        tasks: [
          {
            id: "1",
            title: "Configure PostgreSQL",
            description: "Set up pooled database connection",
            priority: "HIGH",
            status: "DONE",
            createdAt: "2026-11-04T10:00:00Z",
            updatedAt: "2026-11-04T12:00:00Z",
          },
        ],
        pagination: { total: 1, page: 1, limit: 5, totalPages: 1 },
      });

      renderWithProviders(<DashboardView />);

      const taskTitle = await screen.findByText("Configure PostgreSQL");
      expect(taskTitle).toBeInTheDocument();
      expect(screen.getByText("50% DONE")).toBeInTheDocument();
    });
  });

  describe("TasksView", () => {
    it("renders search, filters, and empty state when 0 tasks exist", async () => {
      vi.mocked(api.dashboard.summary).mockResolvedValue({
        total: 0,
        byStatus: { TODO: 0, IN_PROGRESS: 0, DONE: 0 },
      });
      vi.mocked(api.tasks.list).mockResolvedValue({
        tasks: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
      });

      renderWithProviders(<TasksView />);

      expect(screen.getByText("My Tasks")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
      expect(screen.getByLabelText("Filter by Status")).toBeInTheDocument();
      expect(screen.getByLabelText("Filter by Priority")).toBeInTheDocument();

      const emptyText = await screen.findByText("No tasks in your workspace yet");
      expect(emptyText).toBeInTheDocument();
    });
  });

  describe("BoardView", () => {
    it("renders columns with zero tasks empty state", async () => {
      vi.mocked(api.tasks.list).mockResolvedValue({
        tasks: [],
        pagination: { total: 0, page: 1, limit: 100, totalPages: 0 },
      });

      renderWithProviders(<BoardView />);

      expect(screen.getByText("Kanban Board")).toBeInTheDocument();
      const emptyState = await screen.findByText("Board is ready for tasks");
      expect(emptyState).toBeInTheDocument();
    });

    it("renders TO DO, IN PROGRESS, and DONE columns with actual tasks", async () => {
      vi.mocked(api.tasks.list).mockResolvedValue({
        tasks: [
          {
            id: "t1",
            title: "Task in To Do",
            description: "Some description",
            priority: "MEDIUM",
            status: "TODO",
            createdAt: "2026-11-04T10:00:00Z",
            updatedAt: "2026-11-04T12:00:00Z",
          },
          {
            id: "t2",
            title: "Task in Done",
            description: "Finished item",
            priority: "LOW",
            status: "DONE",
            createdAt: "2026-11-04T10:00:00Z",
            updatedAt: "2026-11-04T12:00:00Z",
          },
        ],
        pagination: { total: 2, page: 1, limit: 100, totalPages: 1 },
      });

      renderWithProviders(<BoardView />);

      expect(await screen.findByText("TO DO")).toBeInTheDocument();
      expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
      expect(screen.getByText("DONE")).toBeInTheDocument();
      expect(screen.getByText("Task in To Do")).toBeInTheDocument();
      expect(screen.getByText("Task in Done")).toBeInTheDocument();
    });
  });

  describe("OverviewView", () => {
    it("renders project metadata and breakdown", async () => {
      vi.mocked(api.dashboard.summary).mockResolvedValue({
        total: 1,
        byStatus: { TODO: 0, IN_PROGRESS: 1, DONE: 0 },
      });
      vi.mocked(api.tasks.list).mockResolvedValue({
        tasks: [
          {
            id: "t1",
            title: "Build UI",
            description: null,
            priority: "HIGH",
            status: "IN_PROGRESS",
            createdAt: "2026-11-04T10:00:00Z",
            updatedAt: "2026-11-04T12:00:00Z",
          },
        ],
        pagination: { total: 1, page: 1, limit: 100, totalPages: 1 },
      });

      renderWithProviders(<OverviewView />);

      expect(screen.getByText("Savytics POC Project Overview")).toBeInTheDocument();
      expect(screen.getByText("Next.js 16 App Router")).toBeInTheDocument();
      expect(screen.getByText("Open Task List")).toBeInTheDocument();
      expect(screen.getByText("Open Kanban Board")).toBeInTheDocument();
    });
  });
});

