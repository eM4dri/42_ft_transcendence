import { Component } from '@angular/core';
import { CachedDataService, ChatService } from 'src/app/services';
import { Channel, Chat, User } from 'src/app/models';

export enum EnumChatSidebarSelectedTab {
    CHAT_TAB,
    CHANNEL_TAB,
}
export class EnumChatWindowTypeSeleted {
    public static readonly NONE = 'NONE';
    public static readonly NEW_CHAT = 'NEW_CHAT';
    public static readonly CHAT = 'CHAT';
    public static readonly CHANNEL = 'CHANNEL';
}

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})

export class ChatComponent  {
    typeChat:string = EnumChatWindowTypeSeleted.NONE;
    currentUser: User = {
        userId: '',
        username: '',
    }
    currentChat: Chat = {
      chatId: 'none',
      userId: '0',
      chatUserId: '0',
    };
    newChat: Chat = {
      chatId: 'new',
      userId: '',
      chatUserId: '',
    };
    chatsAvailables: Chat[] = [];

    joinedChannels: Map< string, Channel > = new Map< string, Channel >();
    currentChannel: Channel = {
        channelId: 'none',
        channelName: '0',
        avatar: '',
        isLocked: true
    };
    constructor(
        private readonly chatService: ChatService,
        private readonly cachedDataService: CachedDataService,
      ) {
        this.chatsAvailables = this.cachedDataService.getChatsAvailables();
        this.cachedDataService.getChatsAvailablesSub().subscribe((data) => {
            this.chatsAvailables = data;
        });
        this.joinedChannels = this.cachedDataService.getJoinedChannels();
        this.cachedDataService.getJoinedChannelsSub().subscribe((data) => {
            this.joinedChannels = data;
        });
        this.chatService.userListening().subscribe(val => {
            console.log('user listening here', val);
        });
    }

    public loadNewChat(user: User) {
        const chat = this.chatsAvailables.find( x=> x.userId === user.userId ) || undefined;
        if (chat === undefined) {
            this.typeChat = EnumChatWindowTypeSeleted.NEW_CHAT
            this.currentUser = user;
        } else {
            this.loadChat(chat)
        }
    }

    public loadChat(chat: Chat) {
        this.typeChat = EnumChatWindowTypeSeleted.CHAT
        const user = this.cachedDataService.getUser(chat.userId); 
        if (user !== undefined) {
            this.currentUser = user;
        }
        this.currentChat = chat;
    }

    public loadChannel(channel: Channel){
        this.typeChat = EnumChatWindowTypeSeleted.CHANNEL
        this.currentChannel = channel;
        console.log('loadChannel',channel)
    }
    
    selectedTab : number = EnumChatSidebarSelectedTab.CHAT_TAB;

    showChatTab() {
      this.selectedTab = EnumChatSidebarSelectedTab.CHAT_TAB;
    }
    
    showChannelTab() {
      this.selectedTab = EnumChatSidebarSelectedTab.CHANNEL_TAB;
    }
    
    isChatTabSeleted(){
        return  (this.selectedTab === EnumChatSidebarSelectedTab.CHAT_TAB);
    }
}
