import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISong } from '../song.model';
import { SongService } from '../service/song.service';

const songResolve = (route: ActivatedRouteSnapshot): Observable<null | ISong> => {
  const id = route.params.id;
  if (id) {
    return inject(SongService)
      .find(id)
      .pipe(
        mergeMap((song: HttpResponse<ISong>) => {
          if (song.body) {
            return of(song.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default songResolve;
