/*
  Warnings:

  - You are about to drop the column `created` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chats" DROP COLUMN "created",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "channels" (
    "channelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelName" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "channel_users" (
    "channelUserId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isOwner" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "mutedUntill" TIMESTAMP(3),
    "leaveAt" TIMESTAMP(3),

    CONSTRAINT "channel_users_pkey" PRIMARY KEY ("channelUserId")
);

-- CreateTable
CREATE TABLE "channel_messages" (
    "channelMessageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "channelUserId" TEXT NOT NULL,

    CONSTRAINT "channel_messages_pkey" PRIMARY KEY ("channelMessageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "channels_channelName_key" ON "channels"("channelName");

-- CreateIndex
CREATE UNIQUE INDEX "channel_users_channelId_userId_leaveAt_key" ON "channel_users"("channelId", "userId", "leaveAt");

-- AddForeignKey
ALTER TABLE "channel_users" ADD CONSTRAINT "channel_users_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("channelId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_users" ADD CONSTRAINT "channel_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_messages" ADD CONSTRAINT "channel_messages_channelUserId_fkey" FOREIGN KEY ("channelUserId") REFERENCES "channel_users"("channelUserId") ON DELETE CASCADE ON UPDATE CASCADE;
