import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRecommend } from '../recommend.model';
import { RecommendService } from '../service/recommend.service';

const recommendResolve = (route: ActivatedRouteSnapshot): Observable<null | IRecommend> => {
  const id = route.params.id;
  if (id) {
    return inject(RecommendService)
      .find(id)
      .pipe(
        mergeMap((recommend: HttpResponse<IRecommend>) => {
          if (recommend.body) {
            return of(recommend.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default recommendResolve;
