import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ISong } from '../song.model';

@Component({
  standalone: true,
  selector: 'jhi-song-detail',
  templateUrl: './song-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class SongDetailComponent implements OnInit {
  song = input<ISong | null>(null);
  userRole: string[] = [];
  currentUserId: number | null = null;

  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  ngOnInit(): void {
    this.loadUserData();
  }

  previousState(): void {
    window.history.back();
  }

  isAdmin(): boolean {
    return this.userRole.includes('ROLE_ADMIN');
  }

  protected loadUserData(): void {
    const apiUrl = this.applicationConfigService.getEndpointFor('api/account');

    this.http.get<any>(apiUrl).subscribe({
      next: userData => {
        this.userRole = userData.authorities ?? [];
        this.currentUserId = userData.id;
      },
      error: () => {
        this.userRole = [];
        this.currentUserId = null;
      },
    });
  }
}
