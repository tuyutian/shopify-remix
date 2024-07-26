import type {Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}
const config:Prisma.PrismaClientOptions = {
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
}
const prisma: PrismaClient = global.prisma || new PrismaClient(config);

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient(config);
  }
}
prisma.$on("query", (e:Prisma.QueryEvent ) => {
  console.log('Query: ' + e.query)
  console.log('Params: ' + e.params)
  console.log('Duration: ' + e.duration + 'ms')
})
export default prisma;
