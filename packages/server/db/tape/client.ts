import { PrismaClient } from "@prisma/client";

const tapeDb = new PrismaClient({ log: ["info"] });

export { tapeDb };
