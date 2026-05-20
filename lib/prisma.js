import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

function createPrismaClient() {
  const libsql = createClient({
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  });

  const adapter = new PrismaLibSql(libsql);
  return new PrismaClient({ adapter });
}

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient();
} else {
  // Reuse in dev to avoid exhausting connections on hot reload
  if (!global._prisma) {
    global._prisma = createPrismaClient();
  }
  prisma = global._prisma;
}

export { prisma };
export default prisma;
