/*
  Warnings:

  - You are about to drop the column `user1` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `user2` on the `chats` table. All the data in the column will be lost.
  - Added the required column `userId` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_user1_fkey";

-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_user2_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "user1",
DROP COLUMN "user2",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
