/*
  Warnings:

  - You are about to drop the `Setlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SetlistToSong` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Setlist" DROP CONSTRAINT "Setlist_bandId_fkey";

-- DropForeignKey
ALTER TABLE "_SetlistToSong" DROP CONSTRAINT "_SetlistToSong_A_fkey";

-- DropForeignKey
ALTER TABLE "_SetlistToSong" DROP CONSTRAINT "_SetlistToSong_B_fkey";

-- DropTable
DROP TABLE "Setlist";

-- DropTable
DROP TABLE "_SetlistToSong";

-- CreateTable
CREATE TABLE "SetList" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "bandId" INTEGER NOT NULL,

    CONSTRAINT "SetList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SetListToSong" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SetListToSong_AB_unique" ON "_SetListToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_SetListToSong_B_index" ON "_SetListToSong"("B");

-- AddForeignKey
ALTER TABLE "SetList" ADD CONSTRAINT "SetList_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetListToSong" ADD CONSTRAINT "_SetListToSong_A_fkey" FOREIGN KEY ("A") REFERENCES "SetList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SetListToSong" ADD CONSTRAINT "_SetListToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
