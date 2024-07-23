/*
  Warnings:

  - A unique constraint covering the columns `[profileId]` on the table `CuratedProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId]` on the table `ProfileRestriction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId]` on the table `Verified` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CuratedProfile_profileId_key" ON "CuratedProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileRestriction_profileId_key" ON "ProfileRestriction"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Verified_profileId_key" ON "Verified"("profileId");
