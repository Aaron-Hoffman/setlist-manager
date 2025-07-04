-- CreateTable
CREATE TABLE "Set" (
    "id" SERIAL NOT NULL,
    "setListId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Set_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetSong" (
    "id" SERIAL NOT NULL,
    "setId" INTEGER NOT NULL,
    "songId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SetSong_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Set_setListId_order_key" ON "Set"("setListId", "order");

-- CreateIndex
CREATE INDEX "SetSong_songId_idx" ON "SetSong"("songId");

-- CreateIndex
CREATE INDEX "SetSong_setId_order_idx" ON "SetSong"("setId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "SetSong_setId_songId_key" ON "SetSong"("setId", "songId");

-- AddForeignKey
ALTER TABLE "Set" ADD CONSTRAINT "Set_setListId_fkey" FOREIGN KEY ("setListId") REFERENCES "SetList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetSong" ADD CONSTRAINT "SetSong_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetSong" ADD CONSTRAINT "SetSong_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data migration: Move existing SetListSong data into new Set/SetSong structure

-- For each SetList, create a single Set (order=1, name='Set 1')
INSERT INTO "Set" ("setListId", "name", "order", "createdAt", "updatedAt")
SELECT DISTINCT "setListId", 'Set 1', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "SetListSong";

-- For each SetListSong, create a SetSong in the corresponding Set
INSERT INTO "SetSong" ("setId", "songId", "order", "createdAt", "updatedAt")
SELECT s."id", sls."songId", sls."order", sls."createdAt", sls."updatedAt"
FROM "SetListSong" sls
JOIN "Set" s ON s."setListId" = sls."setListId" AND s."order" = 1;
