/*
  Warnings:

  - Made the column `title` on table `Link` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "LinkCategory" AS ENUM ('SOCIAL', 'BOOKS', 'MOVIES', 'GAMES', 'EDUCATION', 'OTHERS');

-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "category" "LinkCategory" NOT NULL DEFAULT 'OTHERS',
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "title" SET DEFAULT '';

-- CreateIndex
CREATE INDEX "Link_category_idx" ON "Link"("category");
