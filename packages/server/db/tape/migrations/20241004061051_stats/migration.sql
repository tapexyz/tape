-- CreateTable
CREATE TABLE "PlatformStats" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profiles" TEXT NOT NULL,
    "acts" TEXT NOT NULL,
    "posts" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "mirrors" TEXT NOT NULL,
    "creatorEarnings" JSONB NOT NULL,
    "blockTimestamp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformStats_pkey" PRIMARY KEY ("id")
);
