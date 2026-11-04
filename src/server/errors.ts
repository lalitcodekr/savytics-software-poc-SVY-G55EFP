import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super("NOT_FOUND", `${resource} not found`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(details: { field: string; message: string }[]) {
    super("VALIDATION_ERROR", "Invalid request data", 400, details);
  }
}

export function handleError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: { code: error.code, message: error.message, details: error.details } },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const details = error.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Invalid request data", details } },
      { status: 400 }
    );
  }

  // Prisma not found
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2025"
  ) {
    return NextResponse.json(
      { error: { code: "NOT_FOUND", message: "Resource not found" } },
      { status: 404 }
    );
  }

  console.error("[Unhandled Error]", error);
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
    { status: 500 }
  );
}

