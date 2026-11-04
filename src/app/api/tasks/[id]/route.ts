import { NextRequest, NextResponse } from "next/server";
import { UpdateTaskSchema, TaskIdSchema } from "@/schemas/task";
import { getTask, updateTask, deleteTask } from "@/server/services/task.service";
import { handleError } from "@/server/errors";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = TaskIdSchema.parse(await params);
    const task = await getTask(id);
    return NextResponse.json(task);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = TaskIdSchema.parse(await params);
    const body = await request.json();
    const data = UpdateTaskSchema.parse(body);
    const task = await updateTask(id, data);
    return NextResponse.json(task);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = TaskIdSchema.parse(await params);
    await deleteTask(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}

