/*
  Warnings:

  - You are about to drop the column `userId` on the `chat messages` table. All the data in the column will be lost.
  - You are about to drop the `channel messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `channel users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `channels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chat users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user1` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "channel messages" DROP CONSTRAINT "channel messages_channelId_fkey";

-- DropForeignKey
ALTER TABLE "channel messages" DROP CONSTRAINT "channel messages_userId_fkey";

-- DropForeignKey
ALTER TABLE "channel users" DROP CONSTRAINT "channel users_channelId_fkey";

-- DropForeignKey
ALTER TABLE "channel users" DROP CONSTRAINT "channel users_userId_fkey";

-- DropForeignKey
ALTER TABLE "channels" DROP CONSTRAINT "channels_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "chat messages" DROP CONSTRAINT "chat messages_userId_fkey";

-- DropForeignKey
ALTER TABLE "chat users" DROP CONSTRAINT "chat users_chatId_fkey";

-- DropForeignKey
ALTER TABLE "chat users" DROP CONSTRAINT "chat users_userId_fkey";

-- AlterTable
ALTER TABLE "chat messages" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "user1" INTEGER NOT NULL,
ADD COLUMN     "user2" INTEGER NOT NULL;

-- DropTable
DROP TABLE "channel messages";

-- DropTable
DROP TABLE "channel users";

-- DropTable
DROP TABLE "channels";

-- DropTable
DROP TABLE "chat users";

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user1_fkey" FOREIGN KEY ("user1") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_user2_fkey" FOREIGN KEY ("user2") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
