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
  searchTerm = '';

  @ViewChild('thread', { static: true }) private threadContainer!: ElementRef;
  private messageService = inject(MessageService);
  private accountService = inject(AccountService);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      const login = account?.login;
      if (!login) {
        return;
      }
      this.userService.query({ size: 1000 }).subscribe(res => {
        this.allUsers = res.body ?? [];
        this.currentAccount = this.allUsers.find(u => u.login === login);
        this.users = this.allUsers.filter(u => u.login !== login);
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
