import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

interface SpotifyArtist {
  id: string;
  name: string;
}

interface SpotifyResponse {
  items: SpotifyArtist[];
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private clientId = '05b07243b47c4cc28bd9666d031f3784'; // Your Spotify Client ID
  private redirectUri = 'http://localhost:9000/venue-recommendations';

  constructor(private http: HttpClient) {}

  getAuthUrl(): string {
    const scopes = 'user-top-read user-read-private';
    return (
      'https://accounts.spotify.com/authorize' +
      '?response_type=token' +
      '&client_id=' +
      this.clientId +
      '&scope=' +
      encodeURIComponent(scopes) +
      '&redirect_uri=' +
      encodeURIComponent(this.redirectUri)
    );
  }

  getTopArtists(token: string): Observable<SpotifyArtist[]> {
    const url = `/api/spotify/top-artists?token=${encodeURIComponent(token)}&timeRange=medium_term&limit=10`;

    return this.http.get<SpotifyResponse>(url).pipe(
      map(response => response.items),
      catchError(err => {
        console.error('Error fetching Spotify artists:', err);
        return of([]);
      }),
    );
  }
}
