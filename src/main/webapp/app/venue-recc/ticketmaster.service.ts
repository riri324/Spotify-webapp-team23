import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TicketmasterEvent {
  artistName: string;
  venueName: string;
  country: string;
  region: string;
  eventDate: string | null;
  ticketmasterEventId: string;
  imageUrl: string;
  externalUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class TicketmasterService {
  private apiKey = 'NOa1G8utoWSrmii8EzUh7NFkMoKnd2Ax';
  private baseUrl = 'https://app.ticketmaster.com/discovery/v2/events.json';

  constructor(private http: HttpClient) {}

  /**
   * Fetch events for a specific artist
   * @param artistName - Name of the artist
   * @param size - Number of results to return
   * @returns Observable with formatted concert data
   */
  getEventsByArtist(artistName: string, size = 10): Observable<TicketmasterEvent[]> {
    const params = {
      apikey: this.apiKey,
      keyword: artistName,
      classificationName: 'music',
      size: size.toString(),
    };

    return this.http.get(this.baseUrl, { params }).pipe(
      map((response: unknown) => {
        const typedResponse = response as { _embedded?: { events?: unknown[] } };
        if (!typedResponse._embedded?.events) {
          return [];
        }

        return typedResponse._embedded.events.map((event: unknown) => this.formatEventData(event as Record<string, unknown>));
      }),
    );
  }

  /**
   * Get upcoming events near a location
   * @param countryCode - Country code (e.g., 'GB' for United Kingdom)
   * @param city - City name (optional)
   * @param size - Number of results to return
   * @returns Observable with formatted concert data
   */
  getEventsByLocation(countryCode: string, city?: string, size = 10): Observable<TicketmasterEvent[]> {
    const params: Record<string, string> = {
      apikey: this.apiKey,
      countryCode,
      classificationName: 'music',
      size: size.toString(),
    };

    if (city) {
      params.city = city;
    }

    return this.http.get(this.baseUrl, { params }).pipe(
      map((response: unknown) => {
        const typedResponse = response as { _embedded?: { events?: unknown[] } };
        if (!typedResponse._embedded?.events) {
          return [];
        }

        return typedResponse._embedded.events.map((event: unknown) => this.formatEventData(event as Record<string, unknown>));
      }),
    );
  }

  /**
   * Format the Ticketmaster API response into our Concert model
   */
  private formatEventData(event: Record<string, unknown>): TicketmasterEvent {
    const embedded = event._embedded as { venues?: Record<string, unknown>[]; attractions?: Record<string, unknown>[] } | undefined;

    let artistName = 'Unknown Artist';
    let venueName = 'Unknown Venue';
    let country = '';
    let region = '';

    if (embedded?.attractions && embedded.attractions.length > 0) {
      const attraction = embedded.attractions[0];
      if (typeof attraction.name === 'string') {
        artistName = attraction.name;
      }
    }

    if (embedded?.venues && embedded.venues.length > 0) {
      const venue = embedded.venues[0];

      if (typeof venue.name === 'string') {
        venueName = venue.name;
      }

      const venueCountry = venue.country as { name?: string } | undefined;
      if (venueCountry?.name && typeof venueCountry.name === 'string') {
        country = venueCountry.name;
      }

      const venueCity = venue.city as { name?: string } | undefined;
      if (venueCity?.name && typeof venueCity.name === 'string') {
        region = venueCity.name;
      }
    }

    let eventDate: string | null = null;
    const dates = event.dates as { start?: { dateTime?: string } } | undefined;
    if (dates?.start?.dateTime && typeof dates.start.dateTime === 'string') {
      eventDate = dates.start.dateTime;
    }

    const id = typeof event.id === 'string' ? event.id : '';
    const url = typeof event.url === 'string' ? event.url : '';

    const imageUrl = this.getImageUrl(event.images as { width: number; url: string }[] | undefined);

    return {
      artistName,
      venueName,
      country,
      region,
      eventDate,
      ticketmasterEventId: id,
      imageUrl,
      externalUrl: url,
    };
  }

  /**
   * Get the best available image URL from Ticketmaster API
   */
  private getImageUrl(images: { width: number; url: string }[] | undefined): string {
    if (!images || images.length === 0) {
      return '../../content/images/placeholder.jpg';
    }

    for (const img of images) {
      if (img.width >= 300 && img.width <= 500 && typeof img.url === 'string') {
        return img.url;
      }
    }

    return typeof images[0].url === 'string' ? images[0].url : '../../content/images/placeholder.jpg';
  }
}
