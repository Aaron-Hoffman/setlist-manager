/*
  Warnings:

  - You are about to drop the `_SetListToSong` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SetListToSong" DROP CONSTRAINT "_SetListToSong_A_fkey";

-- DropForeignKey
ALTER TABLE "_SetListToSong" DROP CONSTRAINT "_SetListToSong_B_fkey";

-- CreateTable
CREATE TABLE "SetListSong" (
    "id" SERIAL NOT NULL,
    "setListId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SetListSong_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SetListSong_songId_idx" ON "SetListSong"("songId");

-- CreateIndex
CREATE INDEX "SetListSong_setListId_order_idx" ON "SetListSong"("setListId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "SetListSong_setListId_songId_key" ON "SetListSong"("setListId", "songId");

-- AddForeignKey
ALTER TABLE "SetListSong" ADD CONSTRAINT "SetListSong_setListId_fkey" FOREIGN KEY ("setListId") REFERENCES "SetList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetListSong" ADD CONSTRAINT "SetListSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing data from _SetListToSong to SetListSong with order
INSERT INTO "SetListSong" ("setListId", "songId", "order", "createdAt", "updatedAt")
SELECT 
    "A" as "setListId",
    "B" as "songId",
    ROW_NUMBER() OVER (PARTITION BY "A" ORDER BY "B") as "order",
    CURRENT_TIMESTAMP as "createdAt",
    CURRENT_TIMESTAMP as "updatedAt"
FROM "_SetListToSong";

-- DropTable
DROP TABLE "_SetListToSong";
