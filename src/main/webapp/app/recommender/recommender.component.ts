import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlaylistService } from '../entities/playlist/service/playlist.service';
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
  playlistCache: Map<number, ISong[]> = new Map<number, ISong[]>();
  rejectedSongs: Set<number> = new Set<number>();
  selectedSong: ISong | null = null;
  public readonly router = inject(Router);
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  constructor(
    protected playlistService: PlaylistService,
    protected accountService: AccountService,
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const apiUrl = this.applicationConfigService.getEndpointFor('api/account');
    this.http.get<any>(apiUrl).subscribe(userData => {
      if (userData) {
        this.userName = userData.firstName || null;
        this.currentUserId = userData.id;

        // After getting user ID, load playlists that have at least one song
        if (this.currentUserId) {
          this.playlistService.queryUserPlaylists(this.currentUserId).subscribe(response => {
            this.playlists = (response.body ?? []).filter(playlist => playlist.songs && playlist.songs.length > 0);
            // this.initializeCache();

            this.loadSongs();
          });
        }
      }
    });
  }

  // // Initialize in-memory cache, this is for later
  // initializeCache(): void {
  //   // Initialize temporary cache for each playlist
  //   this.playlists.forEach(playlist => {
  //     if (playlist.id && !this.playlistCache.has(playlist.id)) {
  //       this.playlistCache.set(playlist.id, playlist.songs || []);
  //     }
  //   });
  // }

  loadSongs(): void {
    if (!this.playlists || this.playlists.length === 0) {
      this.Songs = [];
      return;
    }

    // Collect one random song from each of the playlists
    const songSet = new Set<ISong>();

    this.playlists.forEach(playlist => {
      if (playlist.songs && playlist.songs.length > 0) {
        const randomIndex = Math.floor(Math.random() * playlist.songs.length);
        songSet.add(playlist.songs[randomIndex]);
      }
    });

    this.Songs = Array.from(songSet);
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
  addSongToPlaylist(song: ISong, playlist: IPlaylist): void {
    if (!song.id || !playlist.id) {
      return;
    }

    // Call the service method to add the song to the playlist
    this.playlistService.addSongToPlaylist(playlist.id, song.id).subscribe({
      next: response => {
        // Show success message
        this.showNotification(`"${song.trackName}" added to "${playlist.name}" playlist`);
        this.togglePlaylistSelector(null);
      },
      error: error => {
        this.showNotification('Failed to add song to playlist. Please try again.', true);
      },
      complete() {
        // Comment so eslint doesnt break
      },
    });
  }

  rejectSong(song: ISong): void {
    // Placeholder function to test button existence
  }

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
