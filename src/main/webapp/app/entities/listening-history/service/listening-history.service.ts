import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IListeningHistory, NewListeningHistory } from '../listening-history.model';

export type PartialUpdateListeningHistory = Partial<IListeningHistory> & Pick<IListeningHistory, 'id'>;

type RestOf<T extends IListeningHistory | NewListeningHistory> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

export type RestListeningHistory = RestOf<IListeningHistory>;

export type NewRestListeningHistory = RestOf<NewListeningHistory>;

export type PartialUpdateRestListeningHistory = RestOf<PartialUpdateListeningHistory>;

export type EntityResponseType = HttpResponse<IListeningHistory>;
export type EntityArrayResponseType = HttpResponse<IListeningHistory[]>;

@Injectable({ providedIn: 'root' })
export class ListeningHistoryService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/listening-histories');

  create(listeningHistory: NewListeningHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(listeningHistory);
    return this.http
      .post<RestListeningHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(listeningHistory: IListeningHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(listeningHistory);
    return this.http
      .put<RestListeningHistory>(`${this.resourceUrl}/${this.getListeningHistoryIdentifier(listeningHistory)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(listeningHistory: PartialUpdateListeningHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(listeningHistory);
    return this.http
      .patch<RestListeningHistory>(`${this.resourceUrl}/${this.getListeningHistoryIdentifier(listeningHistory)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestListeningHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestListeningHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getListeningHistoryIdentifier(listeningHistory: Pick<IListeningHistory, 'id'>): number {
    return listeningHistory.id;
  }

  compareListeningHistory(o1: Pick<IListeningHistory, 'id'> | null, o2: Pick<IListeningHistory, 'id'> | null): boolean {
    return o1 && o2 ? this.getListeningHistoryIdentifier(o1) === this.getListeningHistoryIdentifier(o2) : o1 === o2;
  }

  addListeningHistoryToCollectionIfMissing<Type extends Pick<IListeningHistory, 'id'>>(
    listeningHistoryCollection: Type[],
    ...listeningHistoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const listeningHistories: Type[] = listeningHistoriesToCheck.filter(isPresent);
    if (listeningHistories.length > 0) {
      const listeningHistoryCollectionIdentifiers = listeningHistoryCollection.map(listeningHistoryItem =>
        this.getListeningHistoryIdentifier(listeningHistoryItem),
      );
      const listeningHistoriesToAdd = listeningHistories.filter(listeningHistoryItem => {
        const listeningHistoryIdentifier = this.getListeningHistoryIdentifier(listeningHistoryItem);
        if (listeningHistoryCollectionIdentifiers.includes(listeningHistoryIdentifier)) {
          return false;
        }
        listeningHistoryCollectionIdentifiers.push(listeningHistoryIdentifier);
        return true;
      });
      return [...listeningHistoriesToAdd, ...listeningHistoryCollection];
    }
    return listeningHistoryCollection;
  }

  protected convertDateFromClient<T extends IListeningHistory | NewListeningHistory | PartialUpdateListeningHistory>(
    listeningHistory: T,
  ): RestOf<T> {
    return {
      ...listeningHistory,
      timestamp: listeningHistory.timestamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restListeningHistory: RestListeningHistory): IListeningHistory {
    return {
      ...restListeningHistory,
      timestamp: restListeningHistory.timestamp ? dayjs(restListeningHistory.timestamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestListeningHistory>): HttpResponse<IListeningHistory> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestListeningHistory[]>): HttpResponse<IListeningHistory[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
