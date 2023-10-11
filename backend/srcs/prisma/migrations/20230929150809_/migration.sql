/*
  Warnings:

  - A unique constraint covering the columns `[userId,login]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `stats_user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stats_user" DROP CONSTRAINT "stats_user_userId_fkey";

-- AlterTable
ALTER TABLE "stats_user" ADD COLUMN     "login" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_userId_login_key" ON "users"("userId", "login");

-- AddForeignKey
ALTER TABLE "stats_user" ADD CONSTRAINT "stats_user_userId_login_fkey" FOREIGN KEY ("userId", "login") REFERENCES "users"("userId", "login") ON DELETE CASCADE ON UPDATE CASCADE;
