/*
  Warnings:

  - A unique constraint covering the columns `[id42]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[login]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[url]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id42` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `login` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "id42" INTEGER NOT NULL,
ADD COLUMN     "login" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_id42_key" ON "users"("id42");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "users_url_key" ON "users"("url");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
