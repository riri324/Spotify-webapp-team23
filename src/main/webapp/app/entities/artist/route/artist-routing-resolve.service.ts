import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IArtist } from '../artist.model';
import { ArtistService } from '../service/artist.service';

const artistResolve = (route: ActivatedRouteSnapshot): Observable<null | IArtist> => {
  const id = route.params.id;
  if (id) {
    return inject(ArtistService)
      .find(id)
      .pipe(
        mergeMap((artist: HttpResponse<IArtist>) => {
          if (artist.body) {
            return of(artist.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default artistResolve;
