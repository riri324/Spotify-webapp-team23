import { Component, OnInit } from '@angular/core';
import { GlobalTopsongsService } from '../entities/global-topsongs/service/global-topsongs.service';
import { IGlobalTopsongs } from '../entities/global-topsongs/global-topsongs.model';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouseUser, faRectangleXmark } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'jhi-global-top-songs',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './top-song.component.html',
  styleUrls: ['./top-song.component.scss'],
})
export class TopSongsComponent implements OnInit {
  globalTopsongs: IGlobalTopsongs[] = [];
  currentView: 'month' | 'year' = 'month';
  filteredSongs: IGlobalTopsongs[] = [];

  constructor(
    private topSongsService: GlobalTopsongsService,
    private iconLibrary: FaIconLibrary,
  ) {
    this.iconLibrary.addIcons(faHouseUser, faRectangleXmark);
  }

  ngOnInit(): void {
    this.fetchSongs();
  }

  fetchSongs(): void {
    this.topSongsService.query().subscribe({
      next: res => {
        this.globalTopsongs = res.body ?? [];
        this.filterSongs();
      },
      error(err) {
        console.error('Error loading songs:', err);
      },
    });
  }

  showChart(view: 'month' | 'year'): void {
    this.currentView = view;
    this.filterSongs();
  }

  filterSongs(): void {
    if (this.globalTopsongs.length === 0) return;

    const now = new Date();
    const targetYear = now.getFullYear();
    const targetMonth = now.getMonth() + 1;

    this.filteredSongs = this.globalTopsongs
      .filter(song => {
        if (!song.monthYear) return false;
        const songDate = song.monthYear.toDate();
        const songYear = songDate.getFullYear();
        const songMonth = songDate.getMonth() + 1;

        return (
          (this.currentView === 'month' && songYear === targetYear && songMonth === targetMonth) ||
          (this.currentView === 'year' && songYear === targetYear)
        );
      })
      .sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0));
  }

  goHome(): void {
    window.location.href = '/';
  }
}
