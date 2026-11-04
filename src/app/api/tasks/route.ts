import { NextRequest, NextResponse } from "next/server";
import { TaskQuerySchema, CreateTaskSchema } from "@/schemas/task";
import { listTasks, createTask } from "@/server/services/task.service";
import { handleError } from "@/server/errors";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = TaskQuerySchema.parse(Object.fromEntries(searchParams));
    const result = await listTasks(query);
    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateTaskSchema.parse(body);
    const task = await createTask(data);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

