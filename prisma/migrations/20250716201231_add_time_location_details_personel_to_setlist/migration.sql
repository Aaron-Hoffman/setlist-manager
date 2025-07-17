-- AlterTable
ALTER TABLE "SetList" ADD COLUMN     "details" TEXT,
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "personel" JSONB,
ADD COLUMN     "time" TIMESTAMP(3);
