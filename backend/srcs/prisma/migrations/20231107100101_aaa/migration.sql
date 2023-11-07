-- CreateTable
CREATE TABLE "profile_images" (
    "imageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isUsingDefaultUrl" BOOLEAN NOT NULL,
    "imageSeed" TEXT NOT NULL,
    "imageExtension" TEXT,

    CONSTRAINT "profile_images_pkey" PRIMARY KEY ("imageId")
);

-- CreateTable
CREATE TABLE "banned_list" (
    "banListId" TEXT NOT NULL,
    "userId_banning" TEXT NOT NULL,
    "userId_banned" TEXT NOT NULL,

    CONSTRAINT "banned_list_pkey" PRIMARY KEY ("banListId")
);

-- CreateTable
CREATE TABLE "blocked_list" (
    "BlockedListId" TEXT NOT NULL,
    "userId_blocker" TEXT NOT NULL,
    "userId_blocked" TEXT NOT NULL,

    CONSTRAINT "blocked_list_pkey" PRIMARY KEY ("BlockedListId")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_images_userId_key" ON "profile_images"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "blocked_list_userId_blocker_userId_blocked_key" ON "blocked_list"("userId_blocker", "userId_blocked");

-- AddForeignKey
ALTER TABLE "profile_images" ADD CONSTRAINT "profile_images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banned_list" ADD CONSTRAINT "banned_list_userId_banning_fkey" FOREIGN KEY ("userId_banning") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banned_list" ADD CONSTRAINT "banned_list_userId_banned_fkey" FOREIGN KEY ("userId_banned") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_list" ADD CONSTRAINT "blocked_list_userId_blocker_fkey" FOREIGN KEY ("userId_blocker") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocked_list" ADD CONSTRAINT "blocked_list_userId_blocked_fkey" FOREIGN KEY ("userId_blocked") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
