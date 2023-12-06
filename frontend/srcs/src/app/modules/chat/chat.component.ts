import { Component } from '@angular/core';
import { Channel, Chat, User } from 'src/app/models';
import { ChannelsCache, ChatsCache, UsersCache } from 'src/app/cache';
import { UserService } from 'src/app/services';

export enum EnumChatSidebarSelectedTab {
    CHAT_TAB,
    CHANNEL_TAB,
}
export class EnumChatWindowTypeSeleted {
    public static readonly NONE = 'NONE';
    public static readonly NEW_CHAT = 'NEW_CHAT';
    public static readonly CHAT = 'CHAT';
    public static readonly CHANNEL = 'CHANNEL';
    public static readonly MANAGE_CHANNEL = 'MANAGE_CHANNEL'
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
        private readonly userService: UserService,
        private readonly cachedChats: ChatsCache,
        private readonly cachedChannels: ChannelsCache,
        private readonly cachedUsers: UsersCache,
      ) {
        this.chatsAvailables = this.cachedChats.getChatsAvailables();
        this.cachedChats.getChatsAvailablesSub().subscribe((data) => {
            this.chatsAvailables = data;
        });
        this.joinedChannels = this.cachedChannels.getJoinedChannels();
        this.cachedChannels.getJoinedChannelsSub().subscribe((data) => {
            this.joinedChannels = data;
        });
        this.cachedChannels.getresetChannelSub().subscribe((data) => {
            if (this.currentChannel.channelId === data.channelId ){
                this.currentChannel = {
                    channelId: 'none',
                    channelName: '0',
                    avatar: '',
                    isLocked: true
                };
                this.typeChat = EnumChatWindowTypeSeleted.NONE
            }
        });
        this.userService.clientReady();
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
        const user = this.cachedUsers.getUser(chat.userId); 
        if (user !== undefined) {
            this.currentUser = user;
        }
        this.currentChat = chat;
    }

    public loadChannel(channel: Channel){
        this.typeChat = EnumChatWindowTypeSeleted.CHANNEL
        this.currentChannel = channel;
    }
    
    selectedTab : number = EnumChatSidebarSelectedTab.CHANNEL_TAB;

    showChatTab() {
      this.selectedTab = EnumChatSidebarSelectedTab.CHAT_TAB;
    }
    
    showChannelTab() {
      this.selectedTab = EnumChatSidebarSelectedTab.CHANNEL_TAB;
    }
    
    isChatTabSeleted(){
        return  (this.selectedTab === EnumChatSidebarSelectedTab.CHAT_TAB);
    }

    public  manageChannel(channel?: Channel){
        this.currentChannel = channel || { channelId: 'none', channelName: '', isLocked: false} ;
        this.typeChat = EnumChatWindowTypeSeleted.MANAGE_CHANNEL;
    }
    public goBackToChannel() {
        if (this.currentChannel.channelId !== 'none') {
            this.typeChat = EnumChatWindowTypeSeleted.CHANNEL;
        } else {
            this.typeChat = EnumChatWindowTypeSeleted.NONE;
        }
    }
}
