/*
  Warnings:

  - Made the column `creatorEarnings` on table `PlatformStats` required. This step will fail if there are existing NULL values in that column.
  - Made the column `blockTimestamp` on table `PlatformStats` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PlatformStats" ALTER COLUMN "creatorEarnings" SET NOT NULL,
ALTER COLUMN "blockTimestamp" SET NOT NULL;
