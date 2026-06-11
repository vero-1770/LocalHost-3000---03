/*
  Warnings:

  - Made the column `passwordHash` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "passwordHash" SET NOT NULL;
