import { Component, OnInit } from '@angular/core';
import { Message, MessageStatus, User } from './messages.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'jhi-messages',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss', // Notice "styleUrls" is an array of strings
})
export class MessagesComponent implements OnInit {
  userName = 'User Name';
  messages: Message[] = [];

  ngOnInit(): void {
    this.loadSampleMessages();
  }

  trackMessageId(index: number, message: Message): number {
    return message.id;
  }
  loadSampleMessages(): void {
    // Create sample users for sender and recipient
    const sender = new User('john_doe', 'hash123', 'John', 'Doe', 100);
    const recipient = new User('jane_doe', 'hash456', 'Jane', 'Doe', 150);

    // Create sample messages using the Message class constructor
    this.messages = [
      new Message(1, 'Hello!', 'This is a sample message content', new Date(), false, MessageStatus.DELIVERED, sender, recipient),
      new Message(2, 'Greetings', 'Another sample message for testing purposes.', new Date(), true, MessageStatus.READ, sender, recipient),
    ];
  }
}
