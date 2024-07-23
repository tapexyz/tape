-- CreateTable
CREATE TABLE "CuratedProfile" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CuratedProfile_pkey" PRIMARY KEY ("id")
);
