import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

interface SpotifyArtist {
  id: string;
  name: string;
  // Add other properties you might need
}

interface SpotifyResponse {
  items: SpotifyArtist[];
  // Add other properties from Spotify response
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private clientId = '05b07243b47c4cc28bd9666d031f3784'; // Your Spotify Client ID

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  getAuthUrl(): string {
    const scopes = 'user-top-read user-read-private';
    // Use the current origin and path for the redirect URI
    const currentPath = this.document.location.pathname;
    const redirectPath = currentPath.endsWith('/') ? currentPath + 'venue-recommendations' : currentPath;
    const redirectUri = this.document.location.origin + redirectPath;

    return (
      'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' +
      this.clientId +
      '&scope=' +
      encodeURIComponent(scopes) +
      '&redirect_uri=' +
      encodeURIComponent(redirectUri)
    );
  }

  getTopArtists(token: string): Observable<SpotifyArtist[]> {
    // Use proxy endpoint instead of direct Spotify API call
    const url = `/api/spotify/top-artists?token=${encodeURIComponent(token)}&timeRange=medium_term&limit=10`;

    return this.http.get<SpotifyResponse>(url).pipe(
      map(response => response.items),
      catchError(err => {
        // Handle error silently and return empty array
        console.error('Error fetching Spotify artists:', err);
        return of([]);
      }),
    );
  }
}
