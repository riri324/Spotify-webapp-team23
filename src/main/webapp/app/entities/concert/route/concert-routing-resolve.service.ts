import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConcert } from '../concert.model';
import { ConcertService } from '../service/concert.service';

const concertResolve = (route: ActivatedRouteSnapshot): Observable<null | IConcert> => {
  const id = route.params.id;
  if (id) {
    return inject(ConcertService)
      .find(id)
      .pipe(
        mergeMap((concert: HttpResponse<IConcert>) => {
          if (concert.body) {
            return of(concert.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default concertResolve;
