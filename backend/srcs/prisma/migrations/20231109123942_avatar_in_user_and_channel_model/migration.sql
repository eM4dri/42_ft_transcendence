/*
  Warnings:

  - You are about to drop the `profile_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "profile_images" DROP CONSTRAINT "profile_images_userId_fkey";

-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar" TEXT;

-- DropTable
DROP TABLE "profile_images";
