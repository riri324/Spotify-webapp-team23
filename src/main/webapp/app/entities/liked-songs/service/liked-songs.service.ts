import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILikedSongs, NewLikedSongs } from '../liked-songs.model';

export type PartialUpdateLikedSongs = Partial<ILikedSongs> & Pick<ILikedSongs, 'id'>;

export type EntityResponseType = HttpResponse<ILikedSongs>;
export type EntityArrayResponseType = HttpResponse<ILikedSongs[]>;

@Injectable({ providedIn: 'root' })
export class LikedSongsService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/liked-songs');

  create(likedSongs: NewLikedSongs): Observable<EntityResponseType> {
    return this.http.post<ILikedSongs>(this.resourceUrl, likedSongs, { observe: 'response' });
  }

  update(likedSongs: ILikedSongs): Observable<EntityResponseType> {
    return this.http.put<ILikedSongs>(`${this.resourceUrl}/${this.getLikedSongsIdentifier(likedSongs)}`, likedSongs, {
      observe: 'response',
    });
  }

  partialUpdate(likedSongs: PartialUpdateLikedSongs): Observable<EntityResponseType> {
    return this.http.patch<ILikedSongs>(`${this.resourceUrl}/${this.getLikedSongsIdentifier(likedSongs)}`, likedSongs, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILikedSongs>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILikedSongs[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLikedSongsIdentifier(likedSongs: Pick<ILikedSongs, 'id'>): number {
    return likedSongs.id;
  }

  compareLikedSongs(o1: Pick<ILikedSongs, 'id'> | null, o2: Pick<ILikedSongs, 'id'> | null): boolean {
    return o1 && o2 ? this.getLikedSongsIdentifier(o1) === this.getLikedSongsIdentifier(o2) : o1 === o2;
  }

  addLikedSongsToCollectionIfMissing<Type extends Pick<ILikedSongs, 'id'>>(
    likedSongsCollection: Type[],
    ...likedSongsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const likedSongs: Type[] = likedSongsToCheck.filter(isPresent);
    if (likedSongs.length > 0) {
      const likedSongsCollectionIdentifiers = likedSongsCollection.map(likedSongsItem => this.getLikedSongsIdentifier(likedSongsItem));
      const likedSongsToAdd = likedSongs.filter(likedSongsItem => {
        const likedSongsIdentifier = this.getLikedSongsIdentifier(likedSongsItem);
        if (likedSongsCollectionIdentifiers.includes(likedSongsIdentifier)) {
          return false;
        }
        likedSongsCollectionIdentifiers.push(likedSongsIdentifier);
        return true;
      });
      return [...likedSongsToAdd, ...likedSongsCollection];
    }
    return likedSongsCollection;
  }
}
