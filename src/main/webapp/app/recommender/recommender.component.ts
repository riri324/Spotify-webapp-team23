import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../entities/playlist/service/playlist.service';
import { SongService } from '../entities/song/service/song.service';
import { IPlaylist } from '../entities/playlist/playlist.model';
import { ISong } from '../entities/song/song.model';
import { Playlist, Song } from './recommender.model';

@Component({
  selector: 'jhi-recommender',
  standalone: true,
  imports: [],
  templateUrl: './recommender.component.html',
  styleUrl: './recommender.component.scss',
})
export class RecommenderComponent implements OnInit {
  userName = 'User Name';
  playlists?: IPlaylist[];
  Songs?: ISong[];
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
}
