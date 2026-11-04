import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET as getTasks, POST as createTask } from "@/app/api/tasks/route";
import {
  GET as getTaskById,
  PATCH as updateTaskById,
  DELETE as deleteTaskById,
} from "@/app/api/tasks/[id]/route";
import { GET as getDashboardSummary } from "@/app/api/dashboard/summary/route";
import { GET as getHealth } from "@/app/api/health/route";
import * as taskService from "@/server/services/task.service";
import { prisma } from "@/server/db";
import { NotFoundError } from "@/server/errors";

vi.mock("@/server/services/task.service");
vi.mock("@/server/db", () => ({
  prisma: {
    $queryRaw: vi.fn(),
  },
}));

describe("API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/tasks", () => {
    it("returns 200 with task list on valid query", async () => {
      const mockResult = {
        tasks: [{ id: "1", title: "Task 1" }],
        pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
      };
      vi.mocked(taskService.listTasks).mockResolvedValue(
        mockResult as unknown as Awaited<ReturnType<typeof taskService.listTasks>>
      );

      const req = new NextRequest("http://localhost:3000/api/tasks?page=1&limit=20");
      const res = await getTasks(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual(mockResult);
    });

    it("returns 400 when query parameter is invalid", async () => {
      const req = new NextRequest("http://localhost:3000/api/tasks?status=INVALID_STATUS");
      const res = await getTasks(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("POST /api/tasks", () => {
    it("returns 201 when task is created successfully", async () => {
      const createdTask = { id: "123", title: "New Task", priority: "HIGH", status: "TODO" };
      vi.mocked(taskService.createTask).mockResolvedValue(
        createdTask as unknown as Awaited<ReturnType<typeof taskService.createTask>>
      );

      const req = new NextRequest("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title: "New Task", priority: "HIGH" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = await createTask(req);
      const json = await res.json();

      expect(res.status).toBe(201);
      expect(json).toEqual(createdTask);
    });

    it("returns 400 when title is missing", async () => {
      const req = new NextRequest("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify({ description: "No title" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = await createTask(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("GET /api/tasks/[id]", () => {
    const validId = "123e4567-e89b-12d3-a456-426614174000";

    it("returns 200 with the task", async () => {
      const task = { id: validId, title: "My Task" };
      vi.mocked(taskService.getTask).mockResolvedValue(
        task as unknown as Awaited<ReturnType<typeof taskService.getTask>>
      );

      const req = new NextRequest(`http://localhost:3000/api/tasks/${validId}`);
      const res = await getTaskById(req, { params: Promise.resolve({ id: validId }) });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual(task);
    });

    it("returns 400 when task id is not a valid uuid", async () => {
      const req = new NextRequest("http://localhost:3000/api/tasks/not-a-uuid");
      const res = await getTaskById(req, { params: Promise.resolve({ id: "not-a-uuid" }) });
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error.code).toBe("VALIDATION_ERROR");
    });

    it("returns 404 when task is not found", async () => {
      vi.mocked(taskService.getTask).mockRejectedValue(new NotFoundError("Task"));

      const req = new NextRequest(`http://localhost:3000/api/tasks/${validId}`);
      const res = await getTaskById(req, { params: Promise.resolve({ id: validId }) });
      const json = await res.json();

      expect(res.status).toBe(404);
      expect(json.error.code).toBe("NOT_FOUND");
    });
  });

  describe("PATCH /api/tasks/[id]", () => {
    const validId = "123e4567-e89b-12d3-a456-426614174000";

    it("returns 200 with updated task", async () => {
      const updated = { id: validId, title: "Updated", status: "DONE" };
      vi.mocked(taskService.updateTask).mockResolvedValue(
        updated as unknown as Awaited<ReturnType<typeof taskService.updateTask>>
      );

      const req = new NextRequest(`http://localhost:3000/api/tasks/${validId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "DONE" }),
        headers: { "Content-Type": "application/json" },
      });

      const res = await updateTaskById(req, { params: Promise.resolve({ id: validId }) });
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.status).toBe("DONE");
    });
  });

  describe("DELETE /api/tasks/[id]", () => {
    const validId = "123e4567-e89b-12d3-a456-426614174000";

    it("returns 204 on successful delete", async () => {
      vi.mocked(taskService.deleteTask).mockResolvedValue(
        undefined as unknown as Awaited<ReturnType<typeof taskService.deleteTask>>
      );

      const req = new NextRequest(`http://localhost:3000/api/tasks/${validId}`, {
        method: "DELETE",
      });

      const res = await deleteTaskById(req, { params: Promise.resolve({ id: validId }) });
      expect(res.status).toBe(204);
    });
  });

  describe("GET /api/dashboard/summary", () => {
    it("returns summary data with 200", async () => {
      const summary = { total: 5, byStatus: { TODO: 2, IN_PROGRESS: 1, DONE: 2 } };
      vi.mocked(taskService.getDashboardSummary).mockResolvedValue(
        summary as unknown as Awaited<ReturnType<typeof taskService.getDashboardSummary>>
      );

      const res = await getDashboardSummary();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual(summary);
    });
  });

  describe("GET /api/health", () => {
    it("returns 200 ok when db is reachable", async () => {
      (prisma.$queryRaw as unknown as ReturnType<typeof vi.fn>).mockResolvedValue([{ 1: 1 }]);

      const res = await getHealth();
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.status).toBe("ok");
    });

    it("returns 503 error when db throws", async () => {
      (prisma.$queryRaw as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("DB Down"));

      const res = await getHealth();
      const json = await res.json();

      expect(res.status).toBe(503);
      expect(json.status).toBe("error");
    });
  });
});
