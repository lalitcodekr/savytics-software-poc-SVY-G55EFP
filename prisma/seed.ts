import { PrismaClient, Priority, Status } from "@prisma/client";

const prisma = new PrismaClient();

const tasks = [
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
  console.log("🌱 Seeding database...");
  await prisma.task.deleteMany();
  const created = await prisma.task.createMany({ data: tasks });
  console.log(`✅ Created ${created.count} tasks.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

