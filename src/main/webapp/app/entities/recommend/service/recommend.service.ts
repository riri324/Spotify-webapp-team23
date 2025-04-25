import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRecommend, NewRecommend } from '../recommend.model';

export type PartialUpdateRecommend = Partial<IRecommend> & Pick<IRecommend, 'id'>;

export type EntityResponseType = HttpResponse<IRecommend>;
export type EntityArrayResponseType = HttpResponse<IRecommend[]>;

@Injectable({ providedIn: 'root' })
export class RecommendService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/recommends');

  create(recommend: NewRecommend): Observable<EntityResponseType> {
    return this.http.post<IRecommend>(this.resourceUrl, recommend, { observe: 'response' });
  }

  update(recommend: IRecommend): Observable<EntityResponseType> {
    return this.http.put<IRecommend>(`${this.resourceUrl}/${this.getRecommendIdentifier(recommend)}`, recommend, { observe: 'response' });
  }

  partialUpdate(recommend: PartialUpdateRecommend): Observable<EntityResponseType> {
    return this.http.patch<IRecommend>(`${this.resourceUrl}/${this.getRecommendIdentifier(recommend)}`, recommend, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRecommend>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRecommend[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRecommendIdentifier(recommend: Pick<IRecommend, 'id'>): number {
    return recommend.id;
  }

  compareRecommend(o1: Pick<IRecommend, 'id'> | null, o2: Pick<IRecommend, 'id'> | null): boolean {
    return o1 && o2 ? this.getRecommendIdentifier(o1) === this.getRecommendIdentifier(o2) : o1 === o2;
  }

  addRecommendToCollectionIfMissing<Type extends Pick<IRecommend, 'id'>>(
    recommendCollection: Type[],
    ...recommendsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const recommends: Type[] = recommendsToCheck.filter(isPresent);
    if (recommends.length > 0) {
      const recommendCollectionIdentifiers = recommendCollection.map(recommendItem => this.getRecommendIdentifier(recommendItem));
      const recommendsToAdd = recommends.filter(recommendItem => {
        const recommendIdentifier = this.getRecommendIdentifier(recommendItem);
        if (recommendCollectionIdentifiers.includes(recommendIdentifier)) {
          return false;
        }
        recommendCollectionIdentifiers.push(recommendIdentifier);
        return true;
      });
      return [...recommendsToAdd, ...recommendCollection];
    }
    return recommendCollection;
  }
}
