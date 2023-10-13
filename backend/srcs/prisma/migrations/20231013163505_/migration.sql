/*
  Warnings:

  - You are about to drop the column `Draw` on the `historical_games` table. All the data in the column will be lost.
  - Added the required column `draw` to the `historical_games` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "historical_games" DROP COLUMN "Draw",
ADD COLUMN     "draw" BOOLEAN NOT NULL;
