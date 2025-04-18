import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlaylistService } from '../entities/playlist/service/playlist.service';
import {SongService} from "../entities/song/service/song.service";
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
  allSongs?: ISong[]; // Store all songs from the database
  playlistCache: Map<number, ISong[]> = new Map<number, ISong[]>();
  selectedSong: ISong | null = null;
  recommendedSongSource: Map<number, number> = new Map<number, number>();
  public readonly router = inject(Router);
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  constructor(
    protected playlistService: PlaylistService,
    protected accountService: AccountService,
    protected songService: SongService, // Add SongService for fetching all songs
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const apiUrl = this.applicationConfigService.getEndpointFor('api/account');
    this.http.get<any>(apiUrl).subscribe(userData => {
      if (userData) {
        // First, load all songs from the database
        this.loadAllSongs(() => {
          // Then load user playlists
          this.playlistService.queryUserPlaylists().subscribe(response => {
            this.playlists = (response.body ?? []).filter(playlist => playlist.songs && playlist.songs.length > 0);

            // Initialize the cache after loading playlists
            this.initializeCache();

            // Then load recommendations
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

  // Initialize in-memory cache for each playlist
  initializeCache(): void {
    if (!this.playlists || !this.allSongs) return;

    this.playlists.forEach(playlist => {
      if (playlist.id) {
        const playlistSongIds = new Set((playlist.songs || []).map(song => song.id));
        const availableSongs = this.allSongs!.filter(song => song.id && !playlistSongIds.has(song.id));

        this.playlistCache.set(playlist.id, availableSongs);
      }
    });
  }

  loadRecommendations(): void {
    if (!this.playlists || this.playlists.length === 0) {
      this.Songs = [];
      return;
    }
    this.recommendedSongSource.clear();
    const songSet = new Set<ISong>();

    this.playlists.forEach(playlist => {
      if (playlist.id) {
        const availableSongs = this.playlistCache.get(playlist.id);

        if (availableSongs && availableSongs.length > 0) {
          const randomIndex = Math.floor(Math.random() * availableSongs.length);
          const randomSong = availableSongs[randomIndex];
          songSet.add(randomSong);

          if (randomSong.id) {
            this.recommendedSongSource.set(randomSong.id, playlist.id);
          }
        }
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

        // Remove the song from the cache for this playlist
        this.removeSongFromCache(song.id, playlist.id);
        this.togglePlaylistSelector(null);

        // Refresh recommendations
        this.loadRecommendations();
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
    if (song.id) {
      // Find which playlist this song was recommended from
      const sourcePlaylistId = this.recommendedSongSource.get(song.id);

      if (sourcePlaylistId) {
        this.removeSongFromCache(song.id, sourcePlaylistId);
        this.showNotification(`"${song.trackName}" removed from recommendations`);
        this.loadRecommendations();
      }
    }
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
