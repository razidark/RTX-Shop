import { PrismaClient } from '@prisma/client';

let prisma;

// Reuse the Prisma client across serverless invocations to conserve PostgreSQL database connections
const nodeEnv = globalThis.process?.env?.NODE_ENV;
if (nodeEnv === 'production') {
  prisma = new PrismaClient();
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = new PrismaClient();
  }
  prisma = globalThis.prisma;
}

export default prisma;
