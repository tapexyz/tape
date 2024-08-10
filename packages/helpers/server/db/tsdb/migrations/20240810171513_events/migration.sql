-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "actor" TEXT,
    "properties" TEXT,
    "url" TEXT,
    "city" TEXT,
    "country" TEXT,
    "region" TEXT,
    "referrer" TEXT,
    "platform" TEXT,
    "browser" TEXT,
    "browserVersion" TEXT,
    "os" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "fingerprint" TEXT,
    "created" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("created","id")
);

-- CreateIndex
CREATE INDEX "Event_created_idx" ON "Event"("created");
