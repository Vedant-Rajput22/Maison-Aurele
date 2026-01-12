/*
  Warnings:

  - Added the required column `title` to the `LookbookSlideTranslation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LookbookSlideTranslation" ADD COLUMN     "body" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
