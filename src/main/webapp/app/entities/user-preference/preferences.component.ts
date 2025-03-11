import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jhi-preferences',
  standalone: true,
  templateUrl: './preferences.component.html',
  imports: [CommonModule],
  styleUrls: ['./preferences.component.scss'],
})
export class PreferencesComponent {
  questions = [
    { question: 'Which genre do you prefer?', options: ['Pop', 'Rock', 'Jazz', 'Hip-hop', 'Classical', 'Electronic'] },
    {
      question: 'What is your primary reason for listening to music?',
      options: ['Relaxation', 'Workout', 'Studying', 'Partying', 'Traveling'],
    },
    { question: 'What mood do you prefer in music?', options: ['Happy', 'Sad', 'Energetic', 'Calm', 'Romantic'] },
    { question: 'Do you prefer instrumental music or vocal music?', options: ['Instrumental', 'Vocal', 'No preference'] },
    { question: 'When do you usually listen to music?', options: ['Morning', 'Afternoon', 'Evening', 'Night', 'All day'] },
    { question: 'How do you usually listen to music?', options: ['Streaming', 'Downloaded songs', 'Radio', 'Live concerts'] },
    { question: 'What is your preferred song length?', options: ['Short (less than 3 min)', 'Medium (3-5 min)', 'Long (more than 5 min)'] },
    { question: 'How important are lyrics to you?', options: ['Very important', 'Somewhat important', 'Not important'] },
  ];

  currentQuestionIndex = 0;
  selectedPreferences: Record<string, string> = {};
  selectedOption: string | null = null;

  selectPreference(answer: string): void {
    const currentQuestion = this.questions[this.currentQuestionIndex].question;
    this.selectedPreferences[currentQuestion] = answer;
    this.selectedOption = answer;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  savePreferences(): void {
    alert(`Your selected preferences: ${JSON.stringify(this.selectedPreferences, null, 2)}`);
  }
}
