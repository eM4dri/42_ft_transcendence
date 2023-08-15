/*
  Warnings:

  - You are about to drop the column `groupId` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `joinedAt` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the `chatmessages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chatmessages" DROP CONSTRAINT "chatmessages_chatId_fkey";

-- DropForeignKey
ALTER TABLE "chatmessages" DROP CONSTRAINT "chatmessages_userId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_userId_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "groupId",
DROP COLUMN "joinedAt",
DROP COLUMN "userId",
ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "chatmessages";

-- CreateTable
CREATE TABLE "chat users" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "chat users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat messages" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,

    CONSTRAINT "chat messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "public" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel users" (
    "id" SERIAL NOT NULL,
    "channelId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel messages" (
    "id" SERIAL NOT NULL,
    "channelId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,

    CONSTRAINT "channel messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chat users" ADD CONSTRAINT "chat users_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat users" ADD CONSTRAINT "chat users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat messages" ADD CONSTRAINT "chat messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat messages" ADD CONSTRAINT "chat messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "chat users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel users" ADD CONSTRAINT "channel users_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel users" ADD CONSTRAINT "channel users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel messages" ADD CONSTRAINT "channel messages_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel messages" ADD CONSTRAINT "channel messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "channel users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
