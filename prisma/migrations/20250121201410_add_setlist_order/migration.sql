-- CreateTable
CREATE TABLE "SetListItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "songId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "setListId" INTEGER NOT NULL,

    CONSTRAINT "SetListItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SetListItem" ADD CONSTRAINT "SetListItem_setListId_fkey" FOREIGN KEY ("setListId") REFERENCES "SetList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
