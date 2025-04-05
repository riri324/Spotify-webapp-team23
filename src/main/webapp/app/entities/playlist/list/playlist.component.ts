import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { ApplicationConfigService } from '../core/config/application-config.service';

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
  userRole: string | null = null;
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
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      )
      .subscribe();
  }

  protected loadUserData(): void {
    const apiUrl = this.applicationConfigService.getEndpointFor('api/account');
    this.http.get<any>(apiUrl).subscribe(userData => {
      if (userData) {
        this.userRole = userData.authorities?.[0] ?? null;
        this.currentUserId = userData.id;
        // Once we have user data, load playlists
        this.load();
      }
    });
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

    if (this.userRole && this.currentUserId) {
      // If user, get user ID for playlist filtering
      if (this.userRole === 'ROLE_USER') {
        queryObject.userId = this.currentUserId;
      }
      // Mainly needed for admin, since admins should be able to see all
      queryObject.authority = this.userRole;
    }

    return this.playlistService.query(queryObject).pipe(
      tap(() => (this.isLoading = false))
    );
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
