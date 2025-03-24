import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'jhi-recommend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss'],
})
export class RecommendComponent implements OnInit {
  recommendedUsers: any[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRecommendations();
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
      .get<any[]>('/api/recommends/user', { headers })
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

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authenticationToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
