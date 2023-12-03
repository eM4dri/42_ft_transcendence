/*
  Warnings:

  - Added the required column `competitive` to the `historical_games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modded` to the `historical_games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "historical_games" ADD COLUMN     "competitive" BOOLEAN NOT NULL,
ADD COLUMN     "modded" BOOLEAN NOT NULL;
