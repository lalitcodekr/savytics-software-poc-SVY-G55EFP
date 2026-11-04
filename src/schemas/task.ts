import { z } from "zod";

export const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const StatusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE"]);

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional()
    .nullable(),
  priority: PriorityEnum.default("MEDIUM"),
  status: StatusEnum.default("TODO"),
});

export const TaskFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less")
    .trim(),
  description: z
    .string()
    .max(1000, "Description must be 1000 characters or less")
    .optional()
    .nullable(),
  priority: PriorityEnum,
  status: StatusEnum,
});

export type TaskFormValues = z.infer<typeof TaskFormSchema>;
export const UpdateTaskSchema = CreateTaskSchema.partial();

export const TaskQuerySchema = z.object({
  search: z.string().optional(),
  status: StatusEnum.optional(),
  priority: PriorityEnum.optional(),
  sort: z.enum(["newest", "oldest", "priority"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const TaskIdSchema = z.object({
  id: z.string().uuid("Invalid task ID"),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type TaskQuery = z.infer<typeof TaskQuerySchema>;

