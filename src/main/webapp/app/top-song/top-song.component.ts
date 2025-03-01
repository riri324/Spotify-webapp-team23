import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface IGlobalTopSong {
  songTitle: string;
  artistName: string;
}

@Component({
  selector: 'jhi-global-top-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-song.component.html',
  styleUrls: ['./top-song.component.scss'],
})
export class TopSongsComponent {
  globalTopsongs: IGlobalTopSong[] = [
    { songTitle: 'Shape of You', artistName: 'Ed Sheeran' },
    { songTitle: 'Blinding Lights', artistName: 'The Weeknd' },
    { songTitle: 'Rolling in the Deep', artistName: 'Adele' },
  ];

  currentView: 'month' | 'year' = 'month';

  goHome(): void {
    window.location.href = '/';
  }

  showChart(view: 'month' | 'year'): void {
    this.currentView = view;
  }
}
