import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILikedSongs } from '../liked-songs.model';
import { LikedSongsService } from '../service/liked-songs.service';

const likedSongsResolve = (route: ActivatedRouteSnapshot): Observable<null | ILikedSongs> => {
  const id = route.params.id;
  if (id) {
    return inject(LikedSongsService)
      .find(id)
      .pipe(
        mergeMap((likedSongs: HttpResponse<ILikedSongs>) => {
          if (likedSongs.body) {
            return of(likedSongs.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default likedSongsResolve;
