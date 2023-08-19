/*
  Warnings:

  - The primary key for the `chat users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `chats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "chat users" DROP CONSTRAINT "chat users_chatId_fkey";

-- DropForeignKey
ALTER TABLE "chat users" DROP CONSTRAINT "chat users_userId_fkey";

-- AlterTable
ALTER TABLE "chat users" DROP CONSTRAINT "chat users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "chatId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "chat users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "chat users_id_seq";

-- AlterTable
ALTER TABLE "chats" DROP CONSTRAINT "chats_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "chats_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "chats_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "chat users" ADD CONSTRAINT "chat users_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat users" ADD CONSTRAINT "chat users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
