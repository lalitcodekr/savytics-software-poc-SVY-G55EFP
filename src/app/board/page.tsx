import { BoardView } from "@/features/board/board-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kanban Board – Savytics Project Tracker",
  description: "Interactive drag-and-drop Kanban workflow board.",
};

export default function BoardPage() {
  return <BoardView />;
}

