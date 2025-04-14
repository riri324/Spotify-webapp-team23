import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserPreference } from '../user-preference.model';
import { UserPreferenceService } from '../service/user-preference.service';

const userPreferenceResolve = (route: ActivatedRouteSnapshot): Observable<null | IUserPreference> => {
  const id = route.params.id;
  if (id) {
    return inject(UserPreferenceService)
      .find(id)
      .pipe(
        mergeMap((userPreference: HttpResponse<IUserPreference>) => {
          if (userPreference.body) {
            return of(userPreference.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default userPreferenceResolve;
