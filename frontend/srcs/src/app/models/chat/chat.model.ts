
export type Chat = {
    chatId: string,
    userId: string,
    chatUserId: string,
}
    
export type ChatMessages = {
    chatMessageId: string,
    chatUserId: string,
    createdAt: string,
    updatedAt: string,
    message: string
}
    
export type ChatMessage = {
    chatId?: string,
    listenerId: string,
    message: string,
}

  