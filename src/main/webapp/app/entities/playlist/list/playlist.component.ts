import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../../../core/config/application-config.service';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IPlaylist } from '../playlist.model';
import { EntityArrayResponseType, PlaylistService } from '../service/playlist.service';
import { PlaylistDeleteDialogComponent } from '../delete/playlist-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-playlist',
  templateUrl: './playlist.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class PlaylistComponent implements OnInit {
  subscription: Subscription | null = null;
  playlists?: IPlaylist[];
  userRole: string[] = [];
  currentUserId: number | null = null;
  isLoading = false;

  sortState = sortStateSignal({});

  public readonly router = inject(Router);
  protected readonly playlistService = inject(PlaylistService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  trackId = (item: IPlaylist): number => this.playlistService.getPlaylistIdentifier(item);

  ngOnInit(): void {
    this.loadUserData();
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)))
      .subscribe();
  }

  delete(playlist: IPlaylist): void {
    const modalRef = this.modalService.open(PlaylistDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.playlist = playlist;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected loadUserData(): void {
    const apiUrl = this.applicationConfigService.getEndpointFor('api/account');
    this.http.get<any>(apiUrl).subscribe(userData => {
      if (userData) {
        // Authenticated user
        this.userRole = userData.authorities ?? [];
        this.currentUserId = userData.id;
      } else {
        // Unauthenticated user logic
        this.userRole = [];
        this.currentUserId = null; // Or handle as needed
      }
      // Load the playlists after determining the user status
      this.load();
    });
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.playlists = this.refineData(dataFromBody);
  }

  protected refineData(data: IPlaylist[]): IPlaylist[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IPlaylist[] | null): IPlaylist[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;

    const queryObject: any = {
      eagerload: true,
      sort: this.sortService.buildSortParam(this.sortState()),
    };

    // Check if user is logged in and roles are set
    if (this.userRole.length > 0 && this.currentUserId !== null) {
      const isAdmin = this.userRole.includes('ROLE_ADMIN');
      const isUser = this.userRole.includes('ROLE_USER');

      if (isAdmin) {
        // Admin sees all playlists — no need to filter by userId
        queryObject.authority = 'ROLE_ADMIN';
      } else if (isUser) {
        // Regular users only see their own playlists
        queryObject.userId = this.currentUserId;
        queryObject.authority = 'ROLE_USER';
      }
    }

    return this.playlistService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
