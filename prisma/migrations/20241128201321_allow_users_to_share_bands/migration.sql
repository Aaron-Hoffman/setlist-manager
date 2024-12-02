/*
  Warnings:

  - You are about to drop the column `userId` on the `Band` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Band" DROP CONSTRAINT "Band_userId_fkey";

-- AlterTable
ALTER TABLE "Band" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_BandToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BandToUser_AB_unique" ON "_BandToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_BandToUser_B_index" ON "_BandToUser"("B");

-- AddForeignKey
ALTER TABLE "_BandToUser" ADD CONSTRAINT "_BandToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToUser" ADD CONSTRAINT "_BandToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
