/*
  Warnings:

  - You are about to drop the column `userId` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the `chat messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "chat messages" DROP CONSTRAINT "chat messages_chatId_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_userId_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "userId";

-- DropTable
DROP TABLE "chat messages";

-- CreateTable
CREATE TABLE "chat users" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "chat users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chat users" ADD CONSTRAINT "chat users_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat users" ADD CONSTRAINT "chat users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
