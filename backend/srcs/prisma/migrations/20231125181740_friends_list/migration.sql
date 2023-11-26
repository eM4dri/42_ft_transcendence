-- CreateTable
CREATE TABLE "added_list" (
    "FriendListId" TEXT NOT NULL,
    "userId_adding" TEXT NOT NULL,
    "userId_added" TEXT NOT NULL,

    CONSTRAINT "added_list_pkey" PRIMARY KEY ("FriendListId")
);

-- CreateIndex
CREATE UNIQUE INDEX "added_list_userId_adding_userId_added_key" ON "added_list"("userId_adding", "userId_added");

-- AddForeignKey
ALTER TABLE "added_list" ADD CONSTRAINT "added_list_userId_adding_fkey" FOREIGN KEY ("userId_adding") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "added_list" ADD CONSTRAINT "added_list_userId_added_fkey" FOREIGN KEY ("userId_added") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
