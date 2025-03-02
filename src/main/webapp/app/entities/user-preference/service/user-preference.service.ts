import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserPreference, NewUserPreference } from '../user-preference.model';

export type PartialUpdateUserPreference = Partial<IUserPreference> & Pick<IUserPreference, 'id'>;

export type EntityResponseType = HttpResponse<IUserPreference>;
export type EntityArrayResponseType = HttpResponse<IUserPreference[]>;

@Injectable({ providedIn: 'root' })
export class UserPreferenceService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-preferences');

  create(userPreference: NewUserPreference): Observable<EntityResponseType> {
    return this.http.post<IUserPreference>(this.resourceUrl, userPreference, { observe: 'response' });
  }

  update(userPreference: IUserPreference): Observable<EntityResponseType> {
    return this.http.put<IUserPreference>(`${this.resourceUrl}/${this.getUserPreferenceIdentifier(userPreference)}`, userPreference, {
      observe: 'response',
    });
  }

  partialUpdate(userPreference: PartialUpdateUserPreference): Observable<EntityResponseType> {
    return this.http.patch<IUserPreference>(`${this.resourceUrl}/${this.getUserPreferenceIdentifier(userPreference)}`, userPreference, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserPreference>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserPreference[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserPreferenceIdentifier(userPreference: Pick<IUserPreference, 'id'>): number {
    return userPreference.id;
  }

  compareUserPreference(o1: Pick<IUserPreference, 'id'> | null, o2: Pick<IUserPreference, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserPreferenceIdentifier(o1) === this.getUserPreferenceIdentifier(o2) : o1 === o2;
  }

  addUserPreferenceToCollectionIfMissing<Type extends Pick<IUserPreference, 'id'>>(
    userPreferenceCollection: Type[],
    ...userPreferencesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userPreferences: Type[] = userPreferencesToCheck.filter(isPresent);
    if (userPreferences.length > 0) {
      const userPreferenceCollectionIdentifiers = userPreferenceCollection.map(userPreferenceItem =>
        this.getUserPreferenceIdentifier(userPreferenceItem),
      );
      const userPreferencesToAdd = userPreferences.filter(userPreferenceItem => {
        const userPreferenceIdentifier = this.getUserPreferenceIdentifier(userPreferenceItem);
        if (userPreferenceCollectionIdentifiers.includes(userPreferenceIdentifier)) {
          return false;
        }
        userPreferenceCollectionIdentifiers.push(userPreferenceIdentifier);
        return true;
      });
      return [...userPreferencesToAdd, ...userPreferenceCollection];
    }
    return userPreferenceCollection;
  }
}
