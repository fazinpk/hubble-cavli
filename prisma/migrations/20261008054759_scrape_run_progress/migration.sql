-- AlterTable
ALTER TABLE "scrape_runs"
ADD COLUMN "detail_failures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "exhibitors_saved" INTEGER NOT NULL DEFAULT 0;