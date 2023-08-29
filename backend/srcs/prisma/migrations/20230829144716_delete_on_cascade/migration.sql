-- DropForeignKey
ALTER TABLE "chat_user_messages" DROP CONSTRAINT "chat_user_messages_chatUserId_fkey";

-- DropForeignKey
ALTER TABLE "chat_users" DROP CONSTRAINT "chat_users_chatId_fkey";

-- DropForeignKey
ALTER TABLE "chat_users" DROP CONSTRAINT "chat_users_userId_fkey";

-- AddForeignKey
ALTER TABLE "chat_users" ADD CONSTRAINT "chat_users_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("chatId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_users" ADD CONSTRAINT "chat_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_user_messages" ADD CONSTRAINT "chat_user_messages_chatUserId_fkey" FOREIGN KEY ("chatUserId") REFERENCES "chat_users"("chatUserId") ON DELETE CASCADE ON UPDATE CASCADE;
