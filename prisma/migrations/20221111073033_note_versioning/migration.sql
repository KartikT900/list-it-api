/*
  Warnings:

  - You are about to alter the column `ownerId` on the `note` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(20)`.
  - Added the required column `lastModifiedBy` to the `note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "note" ADD COLUMN     "lastModifiedBy" VARCHAR(20) NOT NULL,
ALTER COLUMN "ownerId" SET DATA TYPE VARCHAR(20);

-- CreateTable
CREATE TABLE "noteversion" (
    "id" SERIAL NOT NULL,
    "note_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "modifiedBy" VARCHAR(255) NOT NULL,

    CONSTRAINT "noteversion_pkey" PRIMARY KEY ("id","note_id")
);

-- AddForeignKey
ALTER TABLE "noteversion" ADD CONSTRAINT "noteversion_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "note"("noteId") ON DELETE RESTRICT ON UPDATE CASCADE;
