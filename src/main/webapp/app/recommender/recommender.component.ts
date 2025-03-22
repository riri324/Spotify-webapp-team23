import { Component, OnInit, inject } from '@angular/core';
import { Router} from '@angular/router';
import { PlaylistService } from '../entities/playlist/service/playlist.service';
import { SongService } from '../entities/song/service/song.service';
import { IPlaylist } from '../entities/playlist/playlist.model';
import { ISong } from '../entities/song/song.model';

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
}
