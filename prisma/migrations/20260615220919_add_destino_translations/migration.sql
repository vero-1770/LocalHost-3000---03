/*
  Warnings:

  - You are about to drop the column `country` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `destinations` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `destinations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "destinations" DROP COLUMN "country",
DROP COLUMN "description",
DROP COLUMN "location",
DROP COLUMN "name";

-- CreateTable
CREATE TABLE "destination_translations" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "destinationId" INTEGER NOT NULL,

    CONSTRAINT "destination_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "destination_translations_destinationId_language_key" ON "destination_translations"("destinationId", "language");

-- AddForeignKey
ALTER TABLE "destination_translations" ADD CONSTRAINT "destination_translations_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
