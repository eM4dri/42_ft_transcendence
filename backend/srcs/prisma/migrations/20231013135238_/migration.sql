-- CreateTable
CREATE TABLE "historical_games" (
    "gameId" TEXT NOT NULL,
    "gameDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "localId" TEXT NOT NULL,
    "localName" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "visitorName" TEXT NOT NULL,
    "localGoals" INTEGER NOT NULL DEFAULT 0,
    "visitorGoals" INTEGER NOT NULL DEFAULT 0,
    "winLocal" BOOLEAN NOT NULL,
    "winVisitor" BOOLEAN NOT NULL,
    "Draw" BOOLEAN NOT NULL,
    "pointsLocal" INTEGER NOT NULL DEFAULT 0,
    "pointsVisitor" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "historical_games_pkey" PRIMARY KEY ("gameId")
);
