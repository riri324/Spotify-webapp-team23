import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConcert, NewConcert } from '../concert.model';

export type PartialUpdateConcert = Partial<IConcert> & Pick<IConcert, 'id'>;

type RestOf<T extends IConcert | NewConcert> = Omit<T, 'eventDate'> & {
  eventDate?: string | null;
};

export type RestConcert = RestOf<IConcert>;

export type NewRestConcert = RestOf<NewConcert>;

export type PartialUpdateRestConcert = RestOf<PartialUpdateConcert>;

export type EntityResponseType = HttpResponse<IConcert>;
export type EntityArrayResponseType = HttpResponse<IConcert[]>;

@Injectable({ providedIn: 'root' })
export class ConcertService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/concerts');
  protected ticketmasterUrl = this.applicationConfigService.getEndpointFor('api/ticketmaster');

  create(concert: NewConcert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concert);
    return this.http
      .post<RestConcert>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(concert: IConcert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concert);
    return this.http
      .put<RestConcert>(`${this.resourceUrl}/${this.getConcertIdentifier(concert)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(concert: PartialUpdateConcert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(concert);
    return this.http
      .patch<RestConcert>(`${this.resourceUrl}/${this.getConcertIdentifier(concert)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestConcert>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestConcert[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConcertIdentifier(concert: Pick<IConcert, 'id'>): number {
    return concert.id;
  }

  compareConcert(o1: Pick<IConcert, 'id'> | null, o2: Pick<IConcert, 'id'> | null): boolean {
    return o1 && o2 ? this.getConcertIdentifier(o1) === this.getConcertIdentifier(o2) : o1 === o2;
  }

  addConcertToCollectionIfMissing<Type extends Pick<IConcert, 'id'>>(
    concertCollection: Type[],
    ...concertsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const concerts: Type[] = concertsToCheck.filter(isPresent);
    if (concerts.length > 0) {
      const concertCollectionIdentifiers = concertCollection.map(concertItem => this.getConcertIdentifier(concertItem));
      const concertsToAdd = concerts.filter(concertItem => {
        const concertIdentifier = this.getConcertIdentifier(concertItem);
        if (concertCollectionIdentifiers.includes(concertIdentifier)) {
          return false;
        }
        concertCollectionIdentifiers.push(concertIdentifier);
        return true;
      });
      return [...concertsToAdd, ...concertCollection];
    }
    return concertCollection;
  }

  refreshConcerts(countryCode?: string, city?: string): Observable<unknown> {
    const url = `${this.ticketmasterUrl}/refresh`;

    // Add query parameters if provided
    const params: Record<string, string> = {};
    if (countryCode) params.countryCode = countryCode;
    if (city) params.city = city;

    return this.http.get<unknown>(url, { params });
  }

  refreshConcertsForArtists(artists: string[], countryCode?: string, city?: string): Observable<unknown> {
    const params: Record<string, string> = { artists: artists.slice(0, 5).join(',') };
    if (countryCode) params.countryCode = countryCode;
    if (city) params.city = city;

    return this.http.get<unknown>(`${this.ticketmasterUrl}/refresh-by-artists`, { params });
  }

  getConcertsByArtist(artistName: string, size = 10): Observable<IConcert[]> {
    return this.http
      .get<IConcert[]>(`${this.ticketmasterUrl}/artist/${artistName}?size=${size}`)
      .pipe(map(concerts => concerts.map(concert => this.convertDateFromServer(concert as RestConcert))));
  }

  getConcertsByLocation(countryCode: string, city?: string, size = 10): Observable<IConcert[]> {
    let url = `${this.ticketmasterUrl}/location?countryCode=${countryCode}`;
    if (city) {
      url += `&city=${city}`;
    }
    if (size) {
      url += `&size=${size}`;
    }
    return this.http
      .get<IConcert[]>(url)
      .pipe(map(concerts => concerts.map(concert => this.convertDateFromServer(concert as RestConcert))));
  }

  protected convertDateFromClient<T extends IConcert | NewConcert | PartialUpdateConcert>(concert: T): RestOf<T> {
    return {
      ...concert,
      eventDate: concert.eventDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restConcert: RestConcert): IConcert {
    return {
      ...restConcert,
      eventDate: restConcert.eventDate ? dayjs(restConcert.eventDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestConcert>): HttpResponse<IConcert> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestConcert[]>): HttpResponse<IConcert[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
