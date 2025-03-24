import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Event {
  id: string;
  artistId: string;
  artistName: string;
  venueName: string;
  datetime: string;
  thumbnail: string;
  city: string;
  country: string;
  url: string;
}

interface TicketmasterResponse {
  _embedded?: {
    events?: any[];
  };
}

interface TicketmasterAttraction {
  name?: string;
  [key: string]: any;
}

interface TicketmasterEvent {
  id?: string;
  name?: string;
  _embedded?: {
    attractions?: TicketmasterAttraction[];
    venues?: any[];
  };
  dates?: {
    start?: {
      dateTime?: string;
      localDate?: string;
      localTime?: string;
    };
  };
  images?: { url: string; width?: number; height?: number; ratio?: string }[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class TicketmasterService {
  private apiKey = 'NOa1G8utoWSrmii8EzUh7NFkMoKnd2Ax';

  constructor(private http: HttpClient) {}

  getEventsByArtist(artistName: string, countryCode?: string): Observable<Event[]> {
    let url = `/api/ticketmaster/events?keyword=${encodeURIComponent(artistName)}`;

    if (countryCode) {
      url += `&countryCode=${countryCode}`;
    }

    return this.http.get<TicketmasterResponse>(url).pipe(
      map(response => {
        if (response._embedded?.events) {
          const events = response._embedded.events.map((event: TicketmasterEvent) => this.mapEventData(event, artistName));
          return events.filter(event => event.id !== '');
        }

        return [];
      }),
    );
  }

  getNearbyEvents(latitude: number, longitude: number, radius = 50): Observable<Event[]> {
    const url = `/api/ticketmaster/nearby?lat=${latitude}&lon=${longitude}&radius=${radius}`;

    return this.http.get<TicketmasterResponse>(url).pipe(
      map(response => {
        if (response._embedded?.events) {
          const events = response._embedded.events.map((event: TicketmasterEvent) => {
            const performerName = this.getPerformerName(event);
            return this.mapEventData(event, performerName);
          });
          return events.filter(event => event.id !== '');
        }
        return [];
      }),
    );
  }

  getEventsForArtists(artistNames: string[], countryCode?: string): Observable<Event[]> {
    const requests = artistNames.map(artist => this.getEventsByArtist(artist, countryCode));

    return new Observable<Event[]>(observer => {
      const allEvents: Event[] = [];
      let completed = 0;

      requests.forEach(request => {
        request.subscribe({
          next: events => {
            allEvents.push(...events);
            completed++;

            if (completed === requests.length) {
              const uniqueEvents = this.removeDuplicateEvents(allEvents);
              observer.next(uniqueEvents);
              observer.complete();
            }
          },
          error: () => {
            completed++;

            if (completed === requests.length) {
              const uniqueEvents = this.removeDuplicateEvents(allEvents);
              observer.next(uniqueEvents);
              observer.complete();
            }
          },
        });
      });
    });
  }

  private getPerformerName(event: TicketmasterEvent): string {
    if (event._embedded?.attractions && event._embedded.attractions.length > 0) {
      const attraction = event._embedded.attractions[0];
      return typeof attraction.name === 'string' ? attraction.name : 'Unknown Artist';
    }
    if (event.name && typeof event.name === 'string' && event.name.includes(' at ')) {
      return event.name.split(' at ')[0].trim();
    }
    return typeof event.name === 'string' ? event.name : 'Unknown Artist';
  }

  private mapEventData(event: TicketmasterEvent, artistName: string): Event {
    if (!event.id) {
      return {
        id: '',
        artistId: '',
        artistName: '',
        venueName: '',
        datetime: '',
        thumbnail: '',
        city: '',
        country: '',
        url: '',
      };
    }

    let isValidArtistEvent = false;

    if (event.name && typeof event.name === 'string' && event.name.toLowerCase().includes(artistName.toLowerCase())) {
      isValidArtistEvent = true;
    }

    if (!isValidArtistEvent && event._embedded?.attractions) {
      isValidArtistEvent = event._embedded.attractions.some(
        (attraction: TicketmasterAttraction) =>
          attraction.name && typeof attraction.name === 'string' && attraction.name.toLowerCase().includes(artistName.toLowerCase()),
      );
    }

    if (!isValidArtistEvent && artistName !== this.getPerformerName(event)) {
      return {
        id: '',
        artistId: '',
        artistName: '',
        venueName: '',
        datetime: '',
        thumbnail: '',
        city: '',
        country: '',
        url: '',
      };
    }

    const venue = event._embedded?.venues?.[0] ?? {};

    let thumbnail = '/content/images/placeholder.jpg';
    const images = event.images ?? [];

    if (images.length > 0) {
      const imageUrl = images[0]?.url;
      if (imageUrl && typeof imageUrl === 'string') {
        thumbnail = imageUrl;
      }
    }

    let datetime = 'Date TBD';
    if (event.dates?.start?.dateTime && typeof event.dates.start.dateTime === 'string') {
      datetime = event.dates.start.dateTime;
    } else if (event.dates?.start?.localDate && typeof event.dates.start.localDate === 'string') {
      // If only date is available, use that
      const localDate = event.dates.start.localDate;
      const localTime = event.dates.start.localTime;

      datetime = localTime && typeof localTime === 'string' ? `${localDate} ${localTime}` : localDate;
    }

    return {
      id: typeof event.id === 'string' ? event.id : '',
      artistId: artistName,
      artistName,
      venueName: venue.name && typeof venue.name === 'string' ? venue.name : 'Unknown Venue',
      datetime,
      thumbnail,
      city: venue.city?.name && typeof venue.city.name === 'string' ? venue.city.name : '',
      country: venue.country?.name && typeof venue.country.name === 'string' ? venue.country.name : '',
      url: event.url && typeof event.url === 'string' ? event.url : '',
    };
  }

  private removeDuplicateEvents(events: Event[]): Event[] {
    const seen = new Set<string>();
    return events.filter(event => {
      const key = `${event.venueName}_${event.datetime}_${event.artistName}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}
