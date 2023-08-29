/*
  Warnings:

  - The primary key for the `chats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `chats` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `id42` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `chat users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId42]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - The required column `chatId` was added to the `chats` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `userId` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `userId42` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chat users" DROP CONSTRAINT "chat users_chatId_fkey";

-- DropForeignKey
ALTER TABLE "chat users" DROP CONSTRAINT "chat users_userId_fkey";

-- DropIndex
DROP INDEX "users_id42_key";

-- AlterTable
ALTER TABLE "chats" DROP CONSTRAINT "chats_pkey",
DROP COLUMN "id",
ADD COLUMN     "chatId" TEXT NOT NULL,
ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("chatId");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
DROP COLUMN "id42",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "userId42" INTEGER NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userId");

-- DropTable
DROP TABLE "chat users";

-- CreateTable
CREATE TABLE "chat_users" (
    "chatUserId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "chat_users_pkey" PRIMARY KEY ("chatUserId")
);

-- CreateTable
CREATE TABLE "chat_user_messages" (
    "chatMessageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "message" TEXT NOT NULL,
    "chatUserId" TEXT NOT NULL,

    CONSTRAINT "chat_user_messages_pkey" PRIMARY KEY ("chatMessageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userId42_key" ON "users"("userId42");

-- AddForeignKey
ALTER TABLE "chat_users" ADD CONSTRAINT "chat_users_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("chatId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_users" ADD CONSTRAINT "chat_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_user_messages" ADD CONSTRAINT "chat_user_messages_chatUserId_fkey" FOREIGN KEY ("chatUserId") REFERENCES "chat_users"("chatUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
