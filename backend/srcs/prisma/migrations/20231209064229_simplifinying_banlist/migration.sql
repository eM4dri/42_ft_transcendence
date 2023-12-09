/*
  Warnings:

  - You are about to drop the column `userId_banned` on the `banned_list` table. All the data in the column will be lost.
  - You are about to drop the column `userId_banning` on the `banned_list` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `banned_list` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `banned_list` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "banned_list" DROP CONSTRAINT "banned_list_userId_banned_fkey";

-- DropForeignKey
ALTER TABLE "banned_list" DROP CONSTRAINT "banned_list_userId_banning_fkey";

-- AlterTable
ALTER TABLE "banned_list" DROP COLUMN "userId_banned",
DROP COLUMN "userId_banning",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "banned_list_userId_key" ON "banned_list"("userId");

-- AddForeignKey
ALTER TABLE "banned_list" ADD CONSTRAINT "banned_list_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
