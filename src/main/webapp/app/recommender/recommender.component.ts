import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PlaylistService } from '../entities/playlist/service/playlist.service';
import { SongService } from '../entities/song/service/song.service';
import { AccountService } from '../core/auth/account.service';
import { IPlaylist } from '../entities/playlist/playlist.model';
import { ISong } from '../entities/song/song.model';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  playlists: IPlaylist[] = [];
  allSongs?: ISong[];
  playlistCache: Map<number, ISong[]> = new Map<number, ISong[]>();
  playlistRecommendations: PlaylistRecommendation[] = [];

  public readonly router = inject(Router);
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  // Mainly going to just use the numerical features to start off
  // Future implementations (If I bother, would do filters based on genre, artist and etc)
  private songFeatures: (keyof ISong)[] = [
    'danceability',
    'energy',
    'speechiness',
    'acousticness',
    'instrumentalness',
    'liveness',
    'valence',
    'tempo',
  ];

  // KNN set to 1, just need 1 song to be returned
  // Future case where you want to return 5 songs from one playlist
  private k = 1;

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
        const recommendedSong = this.getRecommendedSongForPlaylist(playlist.id, playlist);

        this.playlistRecommendations.push({
          playlist,
          recommendedSong,
        });
      }
    });
  }

  // KNN implementation to get a recommended song
  getRecommendedSongForPlaylist(playlistId: number, playlist: IPlaylist): ISong | null {
    const availableSongs = this.playlistCache.get(playlistId);
    const playlistSongs = playlist.songs;

    if (!availableSongs || availableSongs.length === 0 || !playlistSongs || playlistSongs.length === 0) {
      return null;
    }

    // Select a random song from the playlist as our reference point
    const randomPlaylistSong = playlistSongs[Math.floor(Math.random() * playlistSongs.length)];

    const songDistances = availableSongs
      .map(song => ({
        song,
        distance: this.calculateDistance(randomPlaylistSong, song),
      }))
      .sort((a, b) => a.distance - b.distance);

    // If no songs available, return null
    if (songDistances.length === 0) {
      return null;
    }

    const kNearest = songDistances.slice(0, Math.min(this.k, songDistances.length));

    const randomIndex = Math.floor(Math.random() * kNearest.length);
    return kNearest[randomIndex].song;
  }

  getNewRecommendation(playlistId: number): void {
    const pairIndex = this.playlistRecommendations.findIndex(pair => pair.playlist.id === playlistId);

    if (pairIndex !== -1) {
      const playlist = this.playlistRecommendations[pairIndex].playlist;
      this.playlistRecommendations[pairIndex].recommendedSong = this.getRecommendedSongForPlaylist(playlistId, playlist);
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
        this.removeSongFromCache(song.id, playlist.id);
        this.getNewRecommendation(playlist.id);
      },
      error: error => {
        // Comment so eslint doesnt break
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

  // Calculate Euclidean distance between two songs based on their features
  private calculateDistance(song1: ISong, song2: ISong): number {
    let sumSquaredDiffs = 0;
    let validFeatureCount = 0;

    for (const feature of this.songFeatures) {
      const value1 = song1[feature] as number | null;
      const value2 = song2[feature] as number | null;

      if (value1 !== null && value2 !== null) {
        if (feature === 'tempo') {
          const normalizedValue1 = value1 / 200;
          const normalizedValue2 = value2 / 200;
          sumSquaredDiffs += Math.pow(normalizedValue1 - normalizedValue2, 2);
        } else {
          sumSquaredDiffs += Math.pow(value1 - value2, 2);
        }
        validFeatureCount++;
      }
    }

    // If we have no valid features to compare, return infinity (worst match)
    if (validFeatureCount === 0) {
      return Infinity;
    }

    return Math.sqrt(sumSquaredDiffs) / Math.sqrt(validFeatureCount);
  }
}
