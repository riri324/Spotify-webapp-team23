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
  feedback: any;
  feedbacks: any;

  saveFeedback() {}
}
