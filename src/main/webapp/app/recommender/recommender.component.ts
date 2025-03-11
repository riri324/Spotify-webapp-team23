import { Component, OnInit } from '@angular/core';
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
  playlists: Playlist[] = [];
  recommendedSongs: Song[] = [];

  ngOnInit(): void {
    this.loadSampleData();
  }
  loadSampleData(): void {
    // Create sample playlists using the Playlist class constructor
    this.playlists = [
      new Playlist(1, 'Monkey likes song', 'Name of my actual playlist'),
      new Playlist(2, 'Lofi hip hop vibes', 'Relaxing tracks when you have deadlines incoming'),
    ];

    // Create sample songs using the Song class constructor
    this.recommendedSongs = [
      new Song(
        '123',
        'Shape of You',
        'Ed Sheeran',
        'I have no clue',
        0.8, // danceability
        0.7, // energy
        0.1, // speechiness
        0.2, // acousticness
        0, // instrumentalness
        0.3, // liveness
        0.9, // valence
        120, // tempo
        'Pop', // trackGenre
      ),
      new Song(
        '456',
        'Hey just want to make sure you got your photos printed',
        'Bogos Binted',
        'What',
        0.6, // danceability
        0.5, // energy
        0.2, // speechiness
        0.3, // acousticness
        0, // instrumentalness
        0.4, // liveness
        0.8, // valence
        110, // tempo
        'AlienFace', // trackGenre
      ),
    ];
  }
}
