import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGlobalTopsongs } from '../global-topsongs.model';
import { GlobalTopsongsService } from '../service/global-topsongs.service';

const globalTopsongsResolve = (route: ActivatedRouteSnapshot): Observable<null | IGlobalTopsongs> => {
  const id = route.params.id;
  if (id) {
    return inject(GlobalTopsongsService)
      .find(id)
      .pipe(
        mergeMap((globalTopsongs: HttpResponse<IGlobalTopsongs>) => {
          if (globalTopsongs.body) {
            return of(globalTopsongs.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default globalTopsongsResolve;
