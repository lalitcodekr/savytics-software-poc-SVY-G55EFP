import { NextResponse } from "next/server";
import { getDashboardSummary } from "@/server/services/task.service";
import { handleError } from "@/server/errors";

export async function GET() {
  try {
    const summary = await getDashboardSummary();
    return NextResponse.json(summary);
  } catch (error) {
    return handleError(error);
  }
}

