import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'jhi-feedback',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  isLoading: any;
  feedback = {
    userName: '',
    userEmail: '',
    userPhoneNum: '',
    message: '',
    rating: 0,
  };
  feedbacks: any[] = [];

  saveFeedback() {
    if (!this.feedback.userName || !this.feedback.userEmail) {
      alert('Please fill the required fields.');
      return;
    }

    this.feedbacks.push({ ...this.feedback });
    console.log('feedbacks:', this.feedbacks);
    alert("Thanks for submitting your feeback, we'll get to you ASAP");

    this.feedback = {
      userName: '',
      userEmail: '',
      userPhoneNum: '',
      message: '',
      rating: 0,
    };
  }
}
