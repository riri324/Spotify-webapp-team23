import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { GlobalTopsongsService } from '../service/global-topsongs.service';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IGlobalTopsongs } from '../global-topsongs.model';

@Component({
  standalone: true,
  selector: 'jhi-global-topsongs-detail',
  templateUrl: './global-topsongs-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class GlobalTopsongsDetailComponent implements OnInit {
  globalTopsongs: IGlobalTopsongs | null = null;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected globalTopsongsService: GlobalTopsongsService,
  ) {}

  ngOnInit(): void {
    // Fetching the song ID from the route parameter
    this.activatedRoute.params.subscribe(params => {
      const id = params['id']; // Capture the ID from the URL
      this.loadSongDetails(id);
    });
  }

  loadSongDetails(id: string): void {
    // Call the service to fetch the song by its real ID
    const numericId = Number(id);
    this.globalTopsongsService.find(numericId).subscribe(response => {
      this.globalTopsongs = response.body;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
