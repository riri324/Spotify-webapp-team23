import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGlobalTopsongs, NewGlobalTopsongs } from '../global-topsongs.model';

export type PartialUpdateGlobalTopsongs = Partial<IGlobalTopsongs> & Pick<IGlobalTopsongs, 'id'>;

type RestOf<T extends IGlobalTopsongs | NewGlobalTopsongs> = Omit<T, 'monthYear'> & {
  monthYear?: string | null;
};

export type RestGlobalTopsongs = RestOf<IGlobalTopsongs>;

export type NewRestGlobalTopsongs = RestOf<NewGlobalTopsongs>;

export type PartialUpdateRestGlobalTopsongs = RestOf<PartialUpdateGlobalTopsongs>;

export type EntityResponseType = HttpResponse<IGlobalTopsongs>;
export type EntityArrayResponseType = HttpResponse<IGlobalTopsongs[]>;

@Injectable({ providedIn: 'root' })
export class GlobalTopsongsService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/global-topsongs');

  create(globalTopsongs: NewGlobalTopsongs): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(globalTopsongs);
    return this.http
      .post<RestGlobalTopsongs>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(globalTopsongs: IGlobalTopsongs): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(globalTopsongs);
    return this.http
      .put<RestGlobalTopsongs>(`${this.resourceUrl}/${this.getGlobalTopsongsIdentifier(globalTopsongs)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(globalTopsongs: PartialUpdateGlobalTopsongs): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(globalTopsongs);
    return this.http
      .patch<RestGlobalTopsongs>(`${this.resourceUrl}/${this.getGlobalTopsongsIdentifier(globalTopsongs)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGlobalTopsongs>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGlobalTopsongs[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGlobalTopsongsIdentifier(globalTopsongs: Pick<IGlobalTopsongs, 'id'>): number {
    return globalTopsongs.id;
  }

  compareGlobalTopsongs(o1: Pick<IGlobalTopsongs, 'id'> | null, o2: Pick<IGlobalTopsongs, 'id'> | null): boolean {
    return o1 && o2 ? this.getGlobalTopsongsIdentifier(o1) === this.getGlobalTopsongsIdentifier(o2) : o1 === o2;
  }

  addGlobalTopsongsToCollectionIfMissing<Type extends Pick<IGlobalTopsongs, 'id'>>(
    globalTopsongsCollection: Type[],
    ...globalTopsongsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const globalTopsongs: Type[] = globalTopsongsToCheck.filter(isPresent);
    if (globalTopsongs.length > 0) {
      const globalTopsongsCollectionIdentifiers = globalTopsongsCollection.map(globalTopsongsItem =>
        this.getGlobalTopsongsIdentifier(globalTopsongsItem),
      );
      const globalTopsongsToAdd = globalTopsongs.filter(globalTopsongsItem => {
        const globalTopsongsIdentifier = this.getGlobalTopsongsIdentifier(globalTopsongsItem);
        if (globalTopsongsCollectionIdentifiers.includes(globalTopsongsIdentifier)) {
          return false;
        }
        globalTopsongsCollectionIdentifiers.push(globalTopsongsIdentifier);
        return true;
      });
      return [...globalTopsongsToAdd, ...globalTopsongsCollection];
    }
    return globalTopsongsCollection;
  }

  protected convertDateFromClient<T extends IGlobalTopsongs | NewGlobalTopsongs | PartialUpdateGlobalTopsongs>(
    globalTopsongs: T,
  ): RestOf<T> {
    return {
      ...globalTopsongs,
      monthYear: globalTopsongs.monthYear?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGlobalTopsongs: RestGlobalTopsongs): IGlobalTopsongs {
    return {
      ...restGlobalTopsongs,
      monthYear: restGlobalTopsongs.monthYear ? dayjs(restGlobalTopsongs.monthYear) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGlobalTopsongs>): HttpResponse<IGlobalTopsongs> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGlobalTopsongs[]>): HttpResponse<IGlobalTopsongs[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
