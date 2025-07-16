/*
  Warnings:

  - You are about to drop the column `endTime` on the `Song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SetList" ADD COLUMN     "endTime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "endTime";
