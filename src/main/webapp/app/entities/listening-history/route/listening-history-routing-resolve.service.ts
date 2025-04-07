import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IListeningHistory } from '../listening-history.model';
import { ListeningHistoryService } from '../service/listening-history.service';

const listeningHistoryResolve = (route: ActivatedRouteSnapshot): Observable<null | IListeningHistory> => {
  const id = route.params.id;
  if (id) {
    return inject(ListeningHistoryService)
      .find(id)
      .pipe(
        mergeMap((listeningHistory: HttpResponse<IListeningHistory>) => {
          if (listeningHistory.body) {
            return of(listeningHistory.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default listeningHistoryResolve;
