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

interface PlaylistRecommendation {
  playlist: IPlaylist;
  recommendedSong: ISong | null;
}

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
  playlists: IPlaylist[] = [];
  allSongs?: ISong[]; // Store all songs from the database
  playlistCache: Map<number, ISong[]> = new Map<number, ISong[]>();
  playlistRecommendations: PlaylistRecommendation[] = [];

  public readonly router = inject(Router);
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  constructor(
    protected playlistService: PlaylistService,
    protected accountService: AccountService,
    protected songService: SongService,
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const apiUrl = this.applicationConfigService.getEndpointFor('api/account');
    this.http.get<any>(apiUrl).subscribe(userData => {
      if (userData) {
        this.loadAllSongs(() => {
          this.playlistService.queryUserPlaylists().subscribe(response => {
            this.playlists = (response.body ?? []).filter(playlist => playlist.songs && playlist.songs.length > 0);

            this.initializeCache();
            this.loadRecommendations();
          });
        });
      }
    });
  }

  loadAllSongs(callback: () => void): void {
    // Load all songs from the database
    this.songService.query().subscribe(response => {
      this.allSongs = response.body ?? [];
      callback();
    });
  }

  initializeCache(): void {
    this.playlists.forEach(playlist => {
      if (playlist.id) {
        const playlistSongIds = new Set((playlist.songs ?? []).map(song => song.id));
        const availableSongs = this.allSongs!.filter(song => song.id && !playlistSongIds.has(song.id));

        this.playlistCache.set(playlist.id, availableSongs);
      }
    });
  }

  loadRecommendations(): void {
    this.playlistRecommendations = [];

    this.playlists.forEach(playlist => {
      if (playlist.id) {
        const recommendedSong = this.getRandomSongForPlaylist(playlist.id);

        this.playlistRecommendations.push({
          playlist,
          recommendedSong,
        });
      }
    });
  }

  // For now, get random song, swap out to KNN later
  getRandomSongForPlaylist(playlistId: number): ISong | null {
    const availableSongs = this.playlistCache.get(playlistId);

    if (availableSongs && availableSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableSongs.length);
      return availableSongs[randomIndex];
    }

    return null;
  }

  getNewRecommendation(playlistId: number): void {
    const pairIndex = this.playlistRecommendations.findIndex(pair => pair.playlist.id === playlistId);

    if (pairIndex !== -1) {
      const newRecommendation = this.getRandomSongForPlaylist(playlistId);
      this.playlistRecommendations[pairIndex].recommendedSong = newRecommendation;

      if (newRecommendation) {
        this.showNotification(`New recommendation generated for "${this.playlistRecommendations[pairIndex].playlist.name}"`);
      } else {
        this.showNotification(`No more recommendations available for "${this.playlistRecommendations[pairIndex].playlist.name}"`);
      }
    }
  }

  rejectSong(song: ISong, playlistId: number): void {
    if (!song.id || !playlistId) {
      return;
    }
    this.removeSongFromCache(song.id, playlistId);
    this.getNewRecommendation(playlistId);
  }

  // Method to navigate to the playlist detail page
  navigateToPlaylist(id: number): void {
    this.router.navigate(['/playlist', id, 'view']);
  }

  // Add a song to a playlist
  addSongToPlaylist(song: ISong, playlist: IPlaylist): void {
    if (!song.id || !playlist.id) {
      return;
    }

    // Call the service method to add the song to the playlist
    this.playlistService.addSongToPlaylist(playlist.id, song.id).subscribe({
      next: response => {
        this.showNotification(`"${song.trackName}" added to "${playlist.name}" playlist`);
        this.removeSongFromCache(song.id, playlist.id);

        this.getNewRecommendation(playlist.id);
      },
      error: error => {
        this.showNotification('Failed to add song to playlist. Please try again.', true);
      },
      complete() {
        // Comment so eslint doesnt break
      },
    });
  }

  // Remove a song from a specific playlist's cache
  removeSongFromCache(songId: number, playlistId: number): void {
    const playlistSongs = this.playlistCache.get(playlistId);

    if (playlistSongs) {
      const updatedSongs = playlistSongs.filter(song => song.id !== songId);
      this.playlistCache.set(playlistId, updatedSongs);
    }
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
