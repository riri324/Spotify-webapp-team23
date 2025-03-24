import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlaylistService } from '../entities/playlist/service/playlist.service';
import { SongService } from '../entities/song/service/song.service';
import { IPlaylist } from '../entities/playlist/playlist.model';
import { ISong } from '../entities/song/song.model';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-recommender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommender.component.html',
  styleUrl: './recommender.component.scss',
})
export class RecommenderComponent implements OnInit {
  userName = 'User Name';
  playlists?: IPlaylist[];
  Songs?: ISong[];
  selectedSong: ISong | null = null;
  public readonly router = inject(Router);

  constructor(
    protected playlistService: PlaylistService,
    protected songService: SongService,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    // Fetch Playlists
    this.playlistService.query().subscribe(response => {
      this.playlists = response.body ?? [];
    });

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
