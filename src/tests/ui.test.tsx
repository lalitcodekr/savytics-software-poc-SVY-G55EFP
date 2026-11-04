import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton, TaskCardSkeleton, DashboardSkeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";

describe("UI Components & Utils", () => {
  describe("cn utility", () => {
    it("merges classes correctly with tailwind-merge", () => {
      const result = cn("px-2 py-1", "p-4", { "text-red-500": true, "bg-blue-500": false });
      expect(result).toBe("p-4 text-red-500");
    });
  });

  describe("formatDate utility", () => {
    it("formats dates in en-IN format", () => {
      const formatted = formatDate("2026-05-15T12:00:00Z");
      expect(formatted).toContain("2026");
      expect(formatted).toContain("May");
    });
  });

  describe("Badge component", () => {
    it("renders status badge correctly", () => {
      render(<Badge value="IN_PROGRESS" type="status" />);
      const badge = screen.getByText("In Progress");
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain("bg-blue-100");
    });

    it("renders priority badge correctly", () => {
      render(<Badge value="HIGH" type="priority" />);
      const badge = screen.getByText("High");
      expect(badge).toBeInTheDocument();
      expect(badge.className).toContain("bg-red-100");
    });
  });

  describe("Skeleton components", () => {
    it("renders generic Skeleton with custom className", () => {
      const { container } = render(<Skeleton className="custom-test-skeleton" />);
      const el = container.querySelector(".custom-test-skeleton");
      expect(el).toBeInTheDocument();
      expect(el?.className).toContain("animate-pulse");
    });

    it("renders TaskCardSkeleton structure", () => {
      const { container } = render(<TaskCardSkeleton />);
      const pulses = container.querySelectorAll(".animate-pulse");
      expect(pulses.length).toBeGreaterThanOrEqual(4);
    });

    it("renders DashboardSkeleton with 4 stat placeholders", () => {
      const { container } = render(<DashboardSkeleton />);
      const cards = container.querySelectorAll(".rounded-lg.border.bg-white");
      expect(cards.length).toBe(4);
    });
  });
});
