import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'jhi-recommend',
  standalone: true,
  templateUrl: './recommend.component.html',
  styleUrls: ['./recommend.component.scss'],
})
export class RecommendComponent implements OnInit {
  recommendations: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRecommendations();
  }

  fetchRecommendations(): void {
    this.http.get('/api/music-recommendations').subscribe((data: any) => {
      this.recommendations = data;
    });
  }
}
