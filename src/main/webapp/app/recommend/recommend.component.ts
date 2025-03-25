import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

interface RecommendedUser {
  id: number;
  userId: string;
  recommendedUserId: string;
  commonSongsCount: number;
  // commonSongNames?: string[]; // exists but hidden in UI
}

interface RecommendedSong {
  trackName: string;
  artists: string;
  trackGenre?: string;
}

@Component({
  selector: 'jhi-recommend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss'],
})
export class RecommendComponent implements OnInit {
  recommendedUsers: RecommendedUser[] = [];
  recommendedSongs: RecommendedSong[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRecommendations();
    this.loadSongRecommendations(); // Load both on page init
  }

  generateRecommendations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const headers = this.getAuthHeaders();

    this.http
      .post('/api/recommends/generate', {}, { headers })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.loadRecommendations();
          this.loadSongRecommendations();
        },
        error: error => {
          console.error('Failed to generate recommendations:', error);
          this.errorMessage = 'Error generating recommendations';
        },
      });
  }

  loadRecommendations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const headers = this.getAuthHeaders();

    this.http
      .get<RecommendedUser[]>('/api/recommends/user', { headers })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: response => {
          this.recommendedUsers = response;
        },
        error: error => {
          console.error('Failed to load recommendations:', error);
          this.errorMessage = 'Error loading recommendations';
        },
      });
  }

  loadSongRecommendations(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const headers = this.getAuthHeaders();

    this.http
      .get<RecommendedSong[]>('/api/recommends/songs', { headers })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: response => {
          this.recommendedSongs = response;
        },
        error: error => {
          console.error('Failed to load song recommendations:', error);
          this.errorMessage = 'Error loading song recommendations';
        },
      });
  }

  removeUser(userId: string): void {
    this.recommendedUsers = this.recommendedUsers.filter(u => u.recommendedUserId !== userId);
  }

  dismissSong(songToRemove: RecommendedSong): void {
    this.recommendedSongs = this.recommendedSongs.filter(song => song !== songToRemove);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authenticationToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
