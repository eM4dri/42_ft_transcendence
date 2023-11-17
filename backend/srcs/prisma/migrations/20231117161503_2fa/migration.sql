/*
  Warnings:

  - Added the required column `twofa_code` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "twofa" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twofa_code" TEXT NOT NULL;
