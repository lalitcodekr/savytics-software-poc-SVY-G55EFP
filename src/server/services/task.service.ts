import { prisma } from "@/server/db";
import { NotFoundError } from "@/server/errors";
import type { CreateTaskInput, UpdateTaskInput, TaskQuery } from "@/schemas/task";
import { Prisma } from "@prisma/client";

export async function listTasks(query: TaskQuery) {
  const { search, status, priority, sort, page, limit } = query;

  const where: Prisma.TaskWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;
  if (priority) where.priority = priority;

  const orderBy: Prisma.TaskOrderByWithRelationInput =
    sort === "oldest"
      ? { createdAt: "asc" }
      : sort === "priority"
      ? { priority: "desc" }
      : { createdAt: "desc" };

  const [tasks, total] = await prisma.$transaction([
    prisma.task.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getTask(id: string) {
  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) throw new NotFoundError("Task");
  return task;
}

export async function createTask(data: CreateTaskInput) {
  return prisma.task.create({ data });
}

export async function updateTask(id: string, data: UpdateTaskInput) {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Task");
  return prisma.task.update({ where: { id }, data });
}

export async function deleteTask(id: string) {
  const existing = await prisma.task.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError("Task");
  await prisma.task.delete({ where: { id } });
}

export async function getDashboardSummary() {
  const [total, byStatusRaw] = await prisma.$transaction([
    prisma.task.count(),
    prisma.task.groupBy({
      by: ["status"],
      _count: { status: true },
      orderBy: { status: "asc" },
    }),
  ]);

  const byStatus: { TODO: number; IN_PROGRESS: number; DONE: number } = {
    TODO: 0,
    IN_PROGRESS: 0,
    DONE: 0,
  };
  for (const row of byStatusRaw) {
    if (row.status in byStatus) {
      const count =
        typeof row._count === "object" && row._count !== null
          ? (row._count as Record<string, number>).status ?? 0
          : 0;
      byStatus[row.status] = count;
    }
  }

  return { total, byStatus };
}

