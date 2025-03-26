import { Component, OnInit } from '@angular/core';
import { IMessage } from '../entities/message/message.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService} from '../entities/message/service/message.service';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'jhi-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})

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
export class MessagesComponent implements OnInit {
  messages: IMessage[] = [];
  newMessageContent = '';
  currentUser = 'john_doe'; // Replace with actual logged-in user's login

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    // For demonstration, we query all messages (in production you would filter by recipient or conversation)
    this.messageService.query().subscribe((res: HttpResponse<IMessage[]>) => {
      this.messages = res.body || [];
    });
  }

  sendMessage(): void {
    if (this.newMessageContent.trim() === '') {
      return;
    }
    // Create a new message object


    const newMessage: IMessage = {
      id: null,
      subject: 'New Message',
      content: this.newMessageContent,
      sent: null, // or let the backend set it
      seen: false,
      sender: { login: this.currentUser } as any,
      recipient: { login: 'recipient_user' } as any, // Replace with actual recipient logic
    };
    this.messageService.create(newMessage).subscribe(() => {
      this.newMessageContent = '';
      this.loadMessages(); // Reload messages to see the new one
    });
  }
}
