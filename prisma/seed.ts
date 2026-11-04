import { PrismaClient, Priority, Status } from "@prisma/client";

const prisma = new PrismaClient();

export const demoTasks = [
  {
    title: "Set up project repository",
    description: "Initialize the GitHub repo, add README and documentation.",
    priority: Priority.HIGH,
    status: Status.DONE,
  },
  {
    title: "Design database schema",
    description: "Define Task model with Prisma and run initial migration.",
    priority: Priority.HIGH,
    status: Status.DONE,
  },
  {
    title: "Build REST API endpoints",
    description: "Create CRUD endpoints for tasks with Zod validation.",
    priority: Priority.HIGH,
    status: Status.IN_PROGRESS,
  },
  {
    title: "Implement search and filters",
    description: "Add server-side search by keyword and filter by status/priority.",
    priority: Priority.MEDIUM,
    status: Status.IN_PROGRESS,
  },
  {
    title: "Build dashboard summary",
    description: "Create the /api/dashboard/summary endpoint using Prisma groupBy.",
    priority: Priority.MEDIUM,
    status: Status.TODO,
  },
  {
    title: "Create task list UI",
    description: "Build the task list with loading, empty, and error states.",
    priority: Priority.HIGH,
    status: Status.TODO,
  },
  {
    title: "Add create/edit modal",
    description: "Form with inline validation for creating and editing tasks.",
    priority: Priority.MEDIUM,
    status: Status.TODO,
  },
  {
    title: "Write automated tests",
    description: "Vitest unit and integration tests for services and API handlers.",
    priority: Priority.MEDIUM,
    status: Status.TODO,
  },
  {
    title: "Configure GitHub Actions CI",
    description: "Add workflow that runs lint, type-check, test, and build.",
    priority: Priority.LOW,
    status: Status.TODO,
  },
  {
    title: "Write README with screenshots",
    description: "Document setup, architecture, API reference, and AI tool usage.",
    priority: Priority.LOW,
    status: Status.TODO,
  },
];

async function main() {
  const isDemo = process.argv.includes("--demo") || process.env.SEED_DEMO === "true";
  const isClean = process.argv.includes("--clean") || process.env.CLEAN_TASKS === "true";

  if (isClean) {
    console.log("🧹 Clearing demo tasks from database...");
    const deleted = await prisma.task.deleteMany();
    console.log(`✅ Cleared ${deleted.count} tasks. Database is now empty.`);
    return;
  }

  if (isDemo) {
    console.log("🌱 Populating demonstration tasks for testing/development...");
    await prisma.task.deleteMany();
    const created = await prisma.task.createMany({ data: demoTasks });
    console.log(`✅ Created ${created.count} demonstration tasks.`);
    return;
  }

  console.log("🌱 Database initialization complete.");
  console.log("ℹ️  Fresh installation starts with 0 tasks by default.");
  console.log("ℹ️  To populate sample tasks for manual testing, run: npm run db:seed:demo");
}

main()
  .catch((e) => {
    console.error("Database seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
