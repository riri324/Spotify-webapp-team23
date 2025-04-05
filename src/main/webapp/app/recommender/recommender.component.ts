import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlaylistService } from '../entities/playlist/service/playlist.service';
import { SongService } from '../entities/song/service/song.service';
import { AccountService } from '../core/auth/account.service';
import { IPlaylist } from '../entities/playlist/playlist.model';
import { ISong } from '../entities/song/song.model';
import { CommonModule } from '@angular/common';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../core/config/application-config.service';

@Component({
  selector: 'jhi-recommender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommender.component.html',
  styleUrl: './recommender.component.scss',
})
export class RecommenderComponent implements OnInit {
  userName: string | null = null;
  currentUserId: number | null = null;
  playlists?: IPlaylist[];
  Songs?: ISong[];
  selectedSong: ISong | null = null;
  public readonly router = inject(Router);
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  constructor(
    protected playlistService: PlaylistService,
    protected songService: SongService,
    protected accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.loadSongs();
    this.loadUserData();
  }

  loadUserData(): void {
    const apiUrl = this.applicationConfigService.getEndpointFor('api/account');
    this.http.get<any>(apiUrl).subscribe(userData => {
      if (userData) {
        this.userName = userData.firstName || null;
        this.currentUserId = userData.id;

        // After getting user ID, load playlists
        if (this.currentUserId) {
          this.playlistService.queryUserPlaylists(this.currentUserId).subscribe(response => {
            this.playlists = response.body ?? [];
          });
        }
      }
    });
  }

  loadSongs(): void {
    // Fetch Songs
    this.songService.query().subscribe(response => {
      this.Songs = response.body ?? [];
    });
  }

  // Method to navigate to the playlist detail page
  navigateToPlaylist(id: number): void {
    this.router.navigate(['/playlist', id, 'view']);
  }

  // Toggle the playlist selector dropdown for a song
  togglePlaylistSelector(song: ISong | null): void {
    this.selectedSong = song;
  }

  // Add a song to a playlist

  // Simple notification function
  private showNotification(message: string, isError = false): void {
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification ${isError ? 'notification-error' : 'notification-success'}`;
    notificationElement.textContent = message;
    document.body.appendChild(notificationElement);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notificationElement.classList.add('notification-hide');
      setTimeout(() => {
        document.body.removeChild(notificationElement);
      }, 300);
    }, 3000);
  }
}
