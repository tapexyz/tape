-- CreateTable
CREATE TABLE "Verified" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Verified_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileRestriction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "profileId" TEXT NOT NULL,
    "suspended" INTEGER NOT NULL DEFAULT 0,
    "flagged" INTEGER NOT NULL DEFAULT 0,
    "limited" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileRestriction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AllowedToken" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL DEFAULT 18,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AllowedToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Verified_profileId_idx" ON "Verified"("profileId");

-- CreateIndex
CREATE INDEX "ProfileRestriction_profileId_idx" ON "ProfileRestriction"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "AllowedToken_address_key" ON "AllowedToken"("address");
