import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface SpotifyArtist {
  id: string;
  name: string;
  images?: { url: string; height: number; width: number }[];
}

interface SpotifyTopArtistsResponse {
  items: SpotifyArtist[];
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private clientId = '05b07243b47c4cc28bd9666d031f3784';
  private redirectUri = window.location.origin + window.location.pathname;
  private scope = 'user-top-read user-read-private';
  private authEndpoint = 'https://accounts.spotify.com/authorize';
  private apiEndpoint = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) {}

  /**
   * Get the authentication URL for Spotify login
   */
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'token',
      redirect_uri: this.redirectUri,
      scope: this.scope,
      show_dialog: 'true', // Force display of the Spotify login dialog
    });

    return `${this.authEndpoint}?${params.toString()}`;
  }

  /**
   * Get the user's top artists from Spotify
   */
  getTopArtists(token: string, limit = 20): Observable<SpotifyArtist[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http
      .get<SpotifyTopArtistsResponse>(`${this.apiEndpoint}/me/top/artists?limit=${limit}&time_range=medium_term`, {
        headers,
      })
      .pipe(
        map(response => response.items),
        catchError(error => {
          console.error('Error fetching top artists:', error);
          return of([]);
        }),
      );
  }

  /**
   * Check if a Spotify token is saved in localStorage
   */
  hasToken(): boolean {
    return !!localStorage.getItem('spotify_token');
  }

  /**
   * Get the saved Spotify token
   */
  getToken(): string | null {
    return localStorage.getItem('spotify_token');
  }

  /**
   * Remove the Spotify token
   */
  clearToken(): void {
    localStorage.removeItem('spotify_token');
  }
}
