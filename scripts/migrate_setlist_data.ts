const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateSetListData() {
  // 1. Create a Set for each SetList
  await prisma.$executeRawUnsafe(`
    INSERT INTO "Set" ("setListId", "name", "order", "createdAt", "updatedAt")
    SELECT DISTINCT "setListId", 'Set 1', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    FROM "SetListSong";
  `);

  // 2. Move SetListSong entries to SetSong
  await prisma.$executeRawUnsafe(`
    INSERT INTO "SetSong" ("setId", "songId", "order", "createdAt", "updatedAt")
    SELECT s."id", sls."songId", sls."order", sls."createdAt", sls."updatedAt"
    FROM "SetListSong" sls
    JOIN "Set" s ON s."setListId" = sls."setListId" AND s."order" = 1;
  `);

  console.log('Migration complete!');
  await prisma.$disconnect();
}

migrateSetListData().catch(e => {
  console.error(e);
  process.exit(1);
}); 