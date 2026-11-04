import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getDashboardSummary,
} from "@/server/services/task.service";
import { prisma } from "@/server/db";
import { NotFoundError } from "@/server/errors";

vi.mock("@/server/db", () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      groupBy: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe("Task Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listTasks", () => {
    it("returns tasks and pagination metadata", async () => {
      const mockTasks = [
        {
          id: "task-1",
          title: "Test Task 1",
          description: "Desc",
          priority: "HIGH",
          status: "TODO",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.$transaction as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
        mockTasks,
        1,
      ]);

      const result = await listTasks({
        search: "Test",
        status: "TODO",
        priority: "HIGH",
        sort: "newest",
        page: 1,
        limit: 10,
      });

      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(result.tasks).toEqual(mockTasks);
      expect(result.pagination).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it("handles oldest and priority sorting", async () => {
      (prisma.$transaction as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([[], 0]);

      await listTasks({
        sort: "oldest",
        page: 1,
        limit: 20,
      });
      expect(prisma.$transaction).toHaveBeenCalled();

      await listTasks({
        sort: "priority",
        page: 1,
        limit: 20,
      });
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe("getTask", () => {
    it("returns task when found", async () => {
      const mockTask = { id: "1", title: "Task 1" };
      (prisma.task.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockTask);

      const result = await getTask("1");
      expect(result).toEqual(mockTask);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: "1" } });
    });

    it("throws NotFoundError when task does not exist", async () => {
      (prisma.task.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(getTask("non-existent")).rejects.toThrow(NotFoundError);
    });
  });

  describe("createTask", () => {
    it("creates and returns a new task", async () => {
      const taskInput = {
        title: "New Task",
        description: "New description",
        priority: "MEDIUM" as const,
        status: "TODO" as const,
      };
      const createdTask = { id: "task-new", ...taskInput };
      (prisma.task.create as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(createdTask);

      const result = await createTask(taskInput);
      expect(result).toEqual(createdTask);
      expect(prisma.task.create).toHaveBeenCalledWith({ data: taskInput });
    });
  });

  describe("updateTask", () => {
    it("updates existing task", async () => {
      const existing = { id: "1", title: "Existing" };
      const updated = { id: "1", title: "Updated" };
      (prisma.task.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(existing);
      (prisma.task.update as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(updated);

      const result = await updateTask("1", { title: "Updated" });
      expect(result).toEqual(updated);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { title: "Updated" },
      });
    });

    it("throws NotFoundError if task to update does not exist", async () => {
      (prisma.task.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(updateTask("1", { title: "Updated" })).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteTask", () => {
    it("deletes existing task", async () => {
      const existing = { id: "1", title: "Existing" };
      (prisma.task.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(existing);
      (prisma.task.delete as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(existing);

      await deleteTask("1");
      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: "1" } });
    });

    it("throws NotFoundError if task to delete does not exist", async () => {
      (prisma.task.findUnique as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      await expect(deleteTask("1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("getDashboardSummary", () => {
    it("returns correct count and status breakdown", async () => {
      (prisma.$transaction as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([
        10,
        [
          { status: "TODO", _count: { status: 4 } },
          { status: "IN_PROGRESS", _count: { status: 3 } },
          { status: "DONE", _count: { status: 3 } },
        ],
      ]);

      const summary = await getDashboardSummary();
      expect(summary.total).toBe(10);
      expect(summary.byStatus).toEqual({
        TODO: 4,
        IN_PROGRESS: 3,
        DONE: 3,
      });
    });
  });
});

