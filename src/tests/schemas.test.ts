import { describe, it, expect } from "vitest";
import { CreateTaskSchema, UpdateTaskSchema, TaskQuerySchema } from "@/schemas/task";

describe("CreateTaskSchema", () => {
  it("accepts a valid task", () => {
    const result = CreateTaskSchema.parse({
      title: "My Task",
      description: "Some description",
      priority: "HIGH",
      status: "TODO",
    });
    expect(result.title).toBe("My Task");
    expect(result.priority).toBe("HIGH");
  });

  it("requires title", () => {
    expect(() => CreateTaskSchema.parse({ title: "" })).toThrow();
  });

  it("rejects title longer than 100 chars", () => {
    expect(() => CreateTaskSchema.parse({ title: "a".repeat(101) })).toThrow();
  });

  it("defaults priority to MEDIUM and status to TODO", () => {
    const result = CreateTaskSchema.parse({ title: "Task" });
    expect(result.priority).toBe("MEDIUM");
    expect(result.status).toBe("TODO");
  });

  it("trims whitespace from title", () => {
    const result = CreateTaskSchema.parse({ title: "  My Task  " });
    expect(result.title).toBe("My Task");
  });
});

describe("UpdateTaskSchema", () => {
  it("allows partial updates", () => {
    const result = UpdateTaskSchema.parse({ status: "DONE" });
    expect(result.status).toBe("DONE");
    expect(result.title).toBeUndefined();
  });
});

describe("TaskQuerySchema", () => {
  it("defaults sort to newest and page to 1", () => {
    const result = TaskQuerySchema.parse({});
    expect(result.sort).toBe("newest");
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it("coerces page from string", () => {
    const result = TaskQuerySchema.parse({ page: "3" });
    expect(result.page).toBe(3);
  });

  it("rejects invalid status", () => {
    expect(() => TaskQuerySchema.parse({ status: "INVALID" })).toThrow();
  });
});

