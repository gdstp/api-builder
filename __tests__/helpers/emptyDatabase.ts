import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function emptyDatabase() {
  const tables = Prisma.dmmf.datamodel.models.map(
    (model) => `"${model.dbName || model.name}"`,
  );

  const sql = `TRUNCATE ${tables.join(", ")} RESTART IDENTITY CASCADE;`;
  await prisma.$executeRawUnsafe(sql);
}
