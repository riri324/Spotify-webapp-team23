import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PlaylistService } from '../entities/playlist/service/playlist.service';
import { SongService } from '../entities/song/service/song.service';
import { AccountService } from '../core/auth/account.service';
import { IPlaylist } from '../entities/playlist/playlist.model';
import { ISong } from '../entities/song/song.model';
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
export class RecommenderComponent implements OnInit, OnDestroy {
  userName: string | null = null;
  playlists: IPlaylist[] = [];
  allSongs?: ISong[];
  playlistCache: Map<number, ISong[]> = new Map<number, ISong[]>();
  playlistRecommendations: PlaylistRecommendation[] = [];

  // Keyboard navigation state - similar to your example
  activeSection: 'playlist' | 'addButton' | 'rejectButton' = 'playlist';
  focusedIndex = 0;

  public readonly router = inject(Router);
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly playlistService = inject(PlaylistService);
  protected readonly accountService = inject(AccountService);
  protected readonly songService = inject(SongService);

  // Cleanup subject as in your example
  private readonly destroy$ = new Subject<void>();

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

  private k = 1;

  ngOnInit(): void {
    this.loadUserData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.playlistRecommendations.length === 0) return;

    const maxIndex = this.playlistRecommendations.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        this.focusedIndex = this.focusedIndex + 1 > maxIndex ? 0 : this.focusedIndex + 1;
        this.updateFocus();
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.focusedIndex = this.focusedIndex - 1 < 0 ? maxIndex : this.focusedIndex - 1;
        this.updateFocus();
        event.preventDefault();
        break;
      case 'ArrowLeft':
        if (this.activeSection === 'addButton') {
          this.activeSection = 'playlist';
        } else if (this.activeSection === 'rejectButton') {
          this.activeSection = 'addButton';
        }
        this.updateFocus();
        event.preventDefault();
        break;
      case 'ArrowRight':
        const pair = this.playlistRecommendations[this.focusedIndex];
        if (pair.recommendedSong) {
          if (this.activeSection === 'playlist') {
            this.activeSection = 'addButton';
          } else if (this.activeSection === 'addButton') {
            this.activeSection = 'rejectButton';
          }
          this.updateFocus();
        }
        event.preventDefault();
        break;
      case 'Enter':
        this.performAction();
        event.preventDefault();
        break;
    }
  }

  updateFocus(): void {
    document.querySelectorAll('.keyboard-focus').forEach(el => {
      el.classList.remove('keyboard-focus');
    });

    const pairElement = document.querySelectorAll('.playlist-recommendation-pair')[this.focusedIndex];
    if (!pairElement) return;

    let selector = '';

    switch (this.activeSection) {
      case 'playlist':
        selector = '.playlist-button';
        break;
      case 'addButton':
        selector = '.add-to-playlist-btn';
        break;
      case 'rejectButton':
        selector = '.reject-btn';
        break;
    }

    const elementToFocus = pairElement.querySelector(selector) as HTMLElement;
    if (elementToFocus) {
      elementToFocus.classList.add('keyboard-focus');
      elementToFocus.focus();
    }
  }

  performAction(): void {
    const pair = this.playlistRecommendations[this.focusedIndex];

    if (this.activeSection === 'playlist') {
      if (pair.playlist.id) {
        this.navigateToPlaylist(pair.playlist.id);
      }
    } else if (this.activeSection === 'addButton') {
      if (pair.recommendedSong && pair.playlist) {
        this.addSongToPlaylist(pair.recommendedSong, pair.playlist);
      }
    } else if (this.activeSection === 'rejectButton') {
      if (pair.recommendedSong && pair.playlist.id) {
        this.rejectSong(pair.recommendedSong, pair.playlist.id);
      }
    }
  }

  loadUserData(): void {
    const apiUrl = this.applicationConfigService.getEndpointFor('api/account');
    this.http.get<any>(apiUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe(userData => {
        if (userData) {
          this.userName = userData.firstName || userData.login;
          this.loadAllSongs(() => {
            this.playlistService.queryUserPlaylists()
              .pipe(takeUntil(this.destroy$))
              .subscribe(response => {
                this.playlists = (response.body ?? []).filter(playlist => playlist.songs && playlist.songs.length > 0);
                this.initializeCache();
                this.loadRecommendations();
                this.setInitialFocus();
              });
          });
        }
      });
  }

  setInitialFocus(): void {
    setTimeout(() => {
      this.focusedIndex = 0;
      this.activeSection = 'playlist';
      this.updateFocus();
    }, 100);
  }

  loadAllSongs(callback: () => void): void {
    this.songService.query()
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
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

  getRecommendedSongForPlaylist(playlistId: number, playlist: IPlaylist): ISong | null {
    const availableSongs = this.playlistCache.get(playlistId);
    const playlistSongs = playlist.songs;

    if (!availableSongs || availableSongs.length === 0 || !playlistSongs || playlistSongs.length === 0) {
      return null;
    }

    const randomPlaylistSong = playlistSongs[Math.floor(Math.random() * playlistSongs.length)];

    const songDistances = availableSongs
      .map(song => ({
        song,
        distance: this.calculateDistance(randomPlaylistSong, song),
      }))
      .sort((a, b) => a.distance - b.distance);

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

  navigateToPlaylist(id: number): void {
    this.router.navigate(['/playlist', id, 'view']);
  }

  addSongToPlaylist(song: ISong, playlist: IPlaylist): void {
    if (!song.id || !playlist.id) {
      return;
    }

    this.playlistService.addSongToPlaylist(playlist.id, song.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.removeSongFromCache(song.id, playlist.id);
          this.getNewRecommendation(playlist.id);
        },
        error: () => {
          // Comment so eslint doesnt break
        }
      });
  }

  removeSongFromCache(songId: number, playlistId: number): void {
    const playlistSongs = this.playlistCache.get(playlistId);

    if (playlistSongs) {
      const updatedSongs = playlistSongs.filter(song => song.id !== songId);
      this.playlistCache.set(playlistId, updatedSongs);
    }
  }

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

    if (validFeatureCount === 0) {
      return Infinity;
    }

    return Math.sqrt(sumSquaredDiffs) / Math.sqrt(validFeatureCount);
  }
}
