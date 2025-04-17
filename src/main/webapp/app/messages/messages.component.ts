// import { Component, OnInit } from '@angular/core';
// import { IMessage } from '../entities/message/message.model';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MessageService } from '../entities/message/service/message.service';
// import { HttpResponse } from '@angular/common/http';
//
// @Component({
//   selector: 'jhi-messages',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './messages.component.html',
//   styleUrl: './messages.component.scss',
// })
// export class MessagesComponent implements OnInit {
//   messages: IMessage[] = [];
//   newMessageContent = '';
//   currentUser = 'john_doe'; // Replace with actual logged-in user's login
//
//   constructor(private messageService: MessageService) {}
//
//   ngOnInit(): void {
//     this.loadMessages();
//   }
//
//   loadMessages(): void {
//     // For demonstration, we query all messages (in production you would filter by recipient or conversation)
//     this.messageService.query().subscribe((res: HttpResponse<IMessage[]>) => {
//       this.messages = res.body ?? [];
//     });
//   }
//
//   sendMessage(): void {
//     if (this.newMessageContent.trim() === '') {
//       return;
//     }
//     // Create a new message object
//
//     const newMessage: IMessage = {
//       id: null,
//       subject: 'New Message',
//       content: this.newMessageContent,
//       sent: null, // or let the backend set it
//       seen: false,
//       sender: { login: this.currentUser } as any,
//       recipient: { login: 'recipient_user' } as any, // Replace with actual recipient logic
//     };
//     this.messageService.create(newMessage).subscribe(() => {
//       this.newMessageContent = '';
//       this.loadMessages(); // Reload messages to see the new one
//     });
//   }
// }

// export class MessagesComponent implements OnInit {
//   userName = 'User Name';
//   messages: Message[] = [];
//
//   ngOnInit(): void {
//     this.loadSampleMessages();
//   }
//
//   trackMessageId(index: number, message: Message): number {
//     return message.id;
//   }
//   loadSampleMessages(): void {
//     // Create sample users for sender and recipient
//     const sender = new User('john_doe', 'hash123', 'John', 'Doe', 100);
//     const recipient = new User('jane_doe', 'hash456', 'Jane', 'Doe', 150);
//
//     // Create sample messages using the Message class constructor
//     this.messages = [
//       new Message(1, 'Hello!', 'This is a sample message content', new Date(), false, MessageStatus.DELIVERED, sender, recipient),
//       new Message(2, 'Greetings', 'Another sample message for testing purposes.', new Date(), true, MessageStatus.READ, sender, recipient),
//     ];
//   }
// }

// import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HttpResponse } from '@angular/common/http';
//
// import { MessageService } from '../entities/message/service/message.service';
// import { IMessage, NewMessage } from '../entities/message/message.model';
// import { AccountService } from '../core/auth/account.service';
// import { IUser } from 'app/entities/user/user.model';
//
// @Component({
//   selector: 'jhi-messages',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './messages.component.html',
//   styleUrls: ['./messages.component.scss'],
// })
// export class MessagesComponent implements OnInit, AfterViewChecked {
//   @ViewChild('thread') private threadContainer!: ElementRef;
//
//   currentAccount: IUser | null = null;                     // full account object
//   users: Pick<IUser, 'id' | 'login'>[] = [];               // sidebar entries
//   selectedUser: Pick<IUser, 'id' | 'login'> | null = null; // who’s selected
//   allMessages: IMessage[] = [];
//   conversationMessages: IMessage[] = [];
//
//   newMessageContent = '';
//
//   private messageService = inject(MessageService);
//   private accountService = inject(AccountService);
//
//   ngOnInit(): void {
//     this.accountService.identity().subscribe(account => {
//       this.currentAccount = account;
//       this.currentUser = account?.login!; // if you still need the plain login
//       this.loadAllMessages();
//     });
//   }
//
//   ngAfterViewChecked(): void {
//     // Auto-scroll the thread to bottom when new messages appear
//     if (this.threadContainer) {
//       const el = this.threadContainer.nativeElement;
//       el.scrollTop = el.scrollHeight;
//     }
//   }
//
//   private loadAllMessages(): void {
//     this.messageService.query().subscribe((res: HttpResponse<IMessage[]>) => {
//       this.allMessages = res.body ?? [];
//       this.buildUserList();
//     });
//   }
//
//   private buildUserList(): void {
//     const map = new Map<number, Pick<IUser, 'id' | 'login'>>();
//     this.allMessages.forEach(m => {
//       if (m.sender && m.sender.id !== this.currentAccount?.id) {
//         map.set(m.sender.id, m.sender);
//       }
//       if (m.recipient && m.recipient.id !== this.currentAccount?.id) {
//         map.set(m.recipient.id, m.recipient);
//       }
//     });
//     this.users = Array.from(map.values());
//   }
//
//   selectUser(user: string): void {
//     this.selectedUser = user;
//     this.filterConversation();
//   }
//
//   private filterConversation(): void {
//     if (!this.selectedUser || !this.currentAccount) {
//       this.conversationMessages = [];
//       return;
//     }
//     const meId = this.currentAccount.id!;
//     const themId = this.selectedUser.id;
//     this.conversationMessages = this.allMessages
//       .filter(m =>
//         (m.sender?.id === meId && m.recipient?.id === themId) ||
//         (m.sender?.id === themId && m.recipient?.id === meId)
//       )
//       .sort((a, b) => a.sent!.valueOf() - b.sent!.valueOf());
//   }
//
//   sendMessage(): void {
//     if (!this.selectedUser || !this.newMessageContent.trim() || !this.currentAccount) {
//       return;
//     }
//
//     const newMsg: NewMessage = {
//       id: null,
//       subject: '',
//       content: this.newMessageContent,
//       sent: null,
//       seen: false,
//       sender: { id: this.currentAccount.id!, login: this.currentAccount.login! },
//       recipient: { id: this.selectedUser.id, login: this.selectedUser.login },
//     };
//
//     this.messageService.create(newMsg).subscribe(response => {
//       const saved = response.body!;
//       this.allMessages.push(saved);
//       this.filterConversation();
//       this.newMessageContent = '';
//     });
//   }
// }

import { AfterViewChecked, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

import { MessageService } from '../entities/message/service/message.service';
import { IMessage, MessageStatus, NewMessage } from '../entities/message/message.model';
import { AccountService } from '../core/auth/account.service';
import { UserService } from 'app/entities/user/service/user.service';
import { IUser } from 'app/entities/user/user.model';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, AfterViewChecked {
  currentAccount?: IUser;
  users: IUser[] = [];
  selectedUser?: IUser;
  allMessages: IMessage[] = [];
  conversationMessages: IMessage[] = [];
  newMessageContent = '';
  allUsers: IUser[] = [];
  nallUsers: IUser[] = [];
  searchTerm = '';

  @ViewChild('thread', { static: true }) private threadContainer!: ElementRef;
  private messageService = inject(MessageService);
  private accountService = inject(AccountService);
  private userService = inject(UserService);

  // ngOnInit(): void {
  //   this.accountService.identity().subscribe(account => {
  //     const login = account?.login;
  //     if (login) {
  //       // query the backend for the IUser whose login matches
  //       this.userService.query({ 'login.equals': login }).subscribe(res => {
  //         this.allUsers = res.body ?? [];
  //         this.nallUsers = this.allUsers.filter(u => u.login !== this.currentAccount!.login);
  //         // this.currentAccount = res.body?.[0] ?? undefined;
  //         this.currentAccount = this.allUsers.find(u => u.login === this.currentAccount!.login);
  //         this.loadAllMessages();
  //       });
  //     }
  //   });
  // }
  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      const login = account?.login;
      if (!login) {
        return;
      }
      // 1) Load every public user
      this.userService.query({ size: 1000 }).subscribe(res => {
        this.allUsers = res.body ?? [];

        // 2) Find the one whose login matches
        this.currentAccount = this.allUsers.find(u => u.login === login);

        // 3) Build sidebar list (everyone except you)
        this.users = this.allUsers.filter(u => u.login !== login);

        // 4) Now that currentAccount is set, load messages
        this.loadAllMessages();
      });
    });
  }

  ngAfterViewChecked(): void {
    const el = this.threadContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
  onSearch(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.users = term
      ? this.allUsers.filter(u => u.login!.toLowerCase().includes(term) && u.login !== this.currentAccount?.login)
      : this.allUsers.filter(u => u.login !== this.currentAccount?.login);
  }
  selectUser(user: IUser): void {
    this.selectedUser = user;
    this.filterConversation();
  }
  sendMessage(): void {
    if (!this.selectedUser || !this.newMessageContent.trim() || !this.currentAccount) return;

    const subject = this.newMessageContent.length > 20 ? this.newMessageContent.substring(0, 20) : this.newMessageContent;

    const newMsg: NewMessage = {
      id: null,
      subject,
      content: this.newMessageContent,
      sent: dayjs(),
      seen: false,
      status: MessageStatus.DELIVERED,
      sender: {
        id: this.currentAccount.id,
        login: this.currentAccount.login,
      },
      recipient: {
        id: this.selectedUser.id,
        login: this.selectedUser.login,
      },
    };

    this.messageService.create(newMsg).subscribe(res => {
      const saved = res.body!;
      this.allMessages.push(saved);
      this.filterConversation();
      this.newMessageContent = '';
    });
  }
  private loadAllMessages(): void {
    this.messageService.query().subscribe((res: HttpResponse<IMessage[]>) => {
      this.allMessages = res.body ?? [];
      this.buildUserList();
    });
  }

  private buildUserList(): void {
    const map = new Map<number, IUser>();
    this.allMessages.forEach(m => {
      if (m.sender && m.sender.id !== this.currentAccount?.id) {
        map.set(m.sender.id, m.sender);
      }
      if (m.recipient && m.recipient.id !== this.currentAccount?.id) {
        map.set(m.recipient.id, m.recipient);
      }
    });
    this.users = Array.from(map.values());
  }

  private filterConversation(): void {
    if (!this.selectedUser || !this.currentAccount) {
      this.conversationMessages = [];
      return;
    }
    const meLogin = this.currentAccount.login;
    this.conversationMessages = this.allMessages
      .filter(
        m =>
          (m.sender?.login === meLogin && m.recipient?.login === this.selectedUser!.login) ||
          (m.sender?.login === this.selectedUser!.login && m.recipient?.login === meLogin),
      )

      .sort((a, b) => (a.sent?.valueOf() ?? 0) - (b.sent?.valueOf() ?? 0));
  }
}
