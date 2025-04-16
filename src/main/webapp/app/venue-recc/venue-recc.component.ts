/* eslint-disable no-console */
import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import dayjs, { Dayjs } from 'dayjs/esm';
import { IConcert } from '../entities/concert/concert.model';
import { ConcertService } from '../entities/concert/service/concert.service';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { SpotifyService } from './spotify.service';

interface GeocodingResponse {
  address?: {
    country_code?: string;
    city?: string;
    town?: string;
    village?: string;
  };
}

@Component({
  selector: 'jhi-venue-recc',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './venue-recc.component.html',
  styleUrl: './venue-recc.component.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class VenueReccComponent implements OnInit {
  activeTab: 'global' | 'local' = 'global';
  globalEvents: IConcert[] = [];
  localEvents: IConcert[] = [];
  eventsToShow: IConcert[] = [];
  loading = true;
  error = false;
  userCountry = '';
  userCity = '';
  locationLoading = false;
  locationError = false;

  spotifyConnected = false;
  spotifyArtists: string[] = [];
  spotifyLoading = false;

  constructor(
    private concertService: ConcertService,
    private http: HttpClient,
    private spotifyService: SpotifyService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.handleSpotifyCallback();

    if (this.spotifyService.hasToken()) {
      this.spotifyConnected = true;
      this.loadSpotifyArtists();
    } else {
      this.refreshConcerts();
    }

    this.getUserLocation();
  }

  handleSpotifyCallback(): void {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');

      if (accessToken) {
        localStorage.setItem('spotify_token', accessToken);
        this.spotifyConnected = true;

        history.replaceState(null, document.title, window.location.pathname + window.location.search);

        this.loadSpotifyArtists();
      }
    }
  }

  loadSpotifyArtists(): void {
    const token = this.spotifyService.getToken();
    if (!token) return;

    this.spotifyLoading = true;
    this.spotifyService.getTopArtists(token).subscribe({
      next: artists => {
        this.spotifyArtists = artists.map(artist => artist.name);
        console.log('Spotify favorite artists:', this.spotifyArtists);

        this.fetchConcertsForArtists(this.spotifyArtists);
        this.spotifyLoading = false;
      },
      error: error => {
        console.error('Error loading Spotify artists:', error);
        this.spotifyLoading = false;

        if (error.status === 401) {
          this.disconnectSpotify();
        } else {
          this.refreshConcerts();
        }
      },
    });
  }

  fetchConcertsForArtists(artists: string[]): void {
    this.loading = true;

    this.concertService.refreshConcertsForArtists(artists, this.userCountry, this.userCity).subscribe({
      next: () => {
        this.loadConcertsWithSpotifyFilter();
      },
      error: error => {
        console.error('Failed to refresh concerts for artists:', error);

        this.loadConcertsWithSpotifyFilter();
      },
    });
  }

  loadConcertsWithSpotifyFilter(): void {
    this.loading = true;
    console.log('Loading concerts with Spotify filter for artists:', this.spotifyArtists);

    this.concertService
      .query()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: res => {
          if (res.body) {
            const concerts = res.body;
            console.log('Total concerts loaded from database:', concerts.length);

            const uniqueArtists = new Set(concerts.map(c => c.artistName).filter(Boolean));
            console.log('Unique artists in database:', Array.from(uniqueArtists));

            const filteredConcerts = this.filterConcertsByArtists(concerts, this.spotifyArtists);

            if (filteredConcerts.length > 0) {
              console.log('Found', filteredConcerts.length, 'concerts matching favorite artists');
              this.processConcerts(filteredConcerts);
            } else {
              console.log('No concerts found matching any favorite artists');
              this.globalEvents = [];
              this.localEvents = [];
            }

            this.switchTab('global'); // Default to global tab
          } else {
            console.error('No response body from concert query');
            this.error = true;
          }
        },
        error: err => {
          console.error('Error loading concerts:', err);
          this.error = true;
        },
      });
  }
  filterConcertsByArtists(concerts: IConcert[], artists: string[]): IConcert[] {
    if (artists.length === 0) {
      return concerts;
    }

    return concerts.filter(concert => {
      if (!concert.artistName) return false;

      const artistName = concert.artistName.toLowerCase();

      for (const artist of artists) {
        const searchName = artist.toLowerCase();

        if (artistName.includes(searchName) || searchName.includes(artistName)) {
          return true;
        }

        const artistWords = artistName.split(' ');
        for (const word of artistWords) {
          if (word.length > 3 && searchName.includes(word)) {
            return true;
          }
        }

        const searchWords = searchName.split(' ');
        for (const word of searchWords) {
          if (word.length > 3 && artistName.includes(word)) {
            return true;
          }
        }
      }

      return false;
    });
  }
  loadConcertsAndFilterByArtists(artists: string[]): void {
    this.loading = true;
    this.concertService
      .query()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: res => {
          if (res.body) {
            // Process concerts but apply artist filter
            this.processConcertsWithArtistFilter(res.body, artists);
            this.switchTab('global');
          } else {
            this.error = true;
          }
        },
        error: () => {
          this.error = true;
        },
      });
  }

  processConcertsWithArtistFilter(concerts: IConcert[], artists: string[]): void {
    const matchesArtist = (concert: IConcert): boolean => {
      if (!concert.artistName) return false;

      const artistNameLower = concert.artistName.toLowerCase();
      return artists.some(artist => {
        const artistLower = artist.toLowerCase();
        return artistNameLower.includes(artistLower) || artistLower.includes(artistNameLower);
      });
    };

    const artistConcerts = concerts.filter(matchesArtist);

    const concertsToProcess = artistConcerts.length > 0 ? artistConcerts : concerts;

    this.processConcerts(concertsToProcess);
  }

  refreshConcerts(): void {
    this.loading = true;

    this.concertService.refreshConcerts(this.userCountry, this.userCity).subscribe({
      next: () => {
        this.loadConcerts();
      },
      error: error => {
        console.error('Failed to refresh concerts:', error);

        this.loadConcerts();
      },
    });
  }

  connectToSpotify(): void {
    const authUrl = this.spotifyService.getAuthUrl();
    this.document.location.href = authUrl;
  }

  disconnectSpotify(): void {
    this.spotifyService.clearToken();
    this.spotifyConnected = false;
    this.spotifyArtists = [];

    this.refreshConcerts();
  }

  getUserLocation(): void {
    this.locationLoading = true;

    // First check if we're on HTTPS or localhost
    const isSecureContext = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

    if (!isSecureContext) {
      console.warn('Geolocation requires HTTPS in production environments');
      this.locationLoading = false;
      this.locationError = true;
      this.setDefaultLocation();
      return;
    }

    // Fix the linting error by checking for geolocation differently
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      console.warn('Geolocation is not supported by this browser');
      this.locationLoading = false;
      this.locationError = true;
      this.setDefaultLocation();
      return;
    }

    const geolocationTimeoutMs = 5000;

    try {
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log('Got geolocation:', position.coords.latitude, position.coords.longitude);
          this.locationLoading = false;
          this.reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        error => {
          console.warn('Geolocation error:', error.code, error.message);
          this.locationLoading = false;
          this.locationError = true;
          this.setDefaultLocation();
        },
        {
          timeout: geolocationTimeoutMs,
          enableHighAccuracy: false,
          maximumAge: 0,
        },
      );
    } catch (e) {
      console.warn('Geolocation not available:', e);
      this.locationLoading = false;
      this.locationError = true;
      this.setDefaultLocation();
    }
  }

  setDefaultLocation(): void {
    this.userCountry = '';
    this.userCity = '';
    this.fetchLocalConcerts();
  }

  reverseGeocode(latitude: number, longitude: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;

    this.http
      .get<GeocodingResponse>(url, {
        headers: {
          'Accept-Language': 'en-US,en',
          'User-Agent': 'team23-music-app', // Add a proper User-Agent
        },
      })
      .subscribe({
        next: response => {
          console.log('Geocoding response:', response);
          const code = response.address?.country_code;
          this.userCountry = code === undefined ? '' : code.toUpperCase();
          this.userCity = response.address?.city ?? response.address?.town ?? response.address?.village ?? '';

          // Store in local storage to avoid multiple API calls
          try {
            localStorage.setItem('user_country', this.userCountry);
            localStorage.setItem('user_city', this.userCity);
          } catch (e) {
            console.warn('Could not save location to local storage:', e);
          }

          this.fetchLocalConcerts();
        },
        error: error => {
          console.error('Reverse geocoding error:', error);
          // Fall back to default values
          this.setDefaultLocation();
        },
      });
  }

  fetchLocalConcerts(): void {
    this.concertService.getConcertsByLocation(this.userCountry, this.userCity, 20).subscribe({
      next: concerts => {
        if (concerts.length > 0) {
          if (this.spotifyConnected && this.spotifyArtists.length > 0) {
            const filteredConcerts = this.filterConcertsByArtists(concerts, this.spotifyArtists);

            this.localEvents = filteredConcerts.length > 0 ? filteredConcerts : [];
          } else {
            this.localEvents = concerts;
          }

          if (this.activeTab === 'local') {
            this.eventsToShow = this.localEvents;
          }
        }
      },
      error(error) {
        console.error('Error fetching local concerts:', error);
      },
    });
  }

  loadConcerts(): void {
    this.loading = true;
    this.concertService
      .query()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: res => {
          if (res.body) {
            this.processConcerts(res.body);
            this.switchTab('global');
          } else {
            this.error = true;
          }
        },
        error: () => {
          this.error = true;
        },
      });
  }

  processConcerts(concerts: IConcert[]): void {
    const ticketmasterConcerts = concerts.filter(concert => concert.ticketmasterEventId !== null);

    if (ticketmasterConcerts.length === 0) {
      this.globalEvents = [...concerts];
      this.localEvents = [...concerts];
      return;
    }

    this.globalEvents = ticketmasterConcerts.filter(
      concert => concert.country !== 'United Kingdom' && concert.country !== 'UK' && concert.country !== 'GB',
    );

    if (this.globalEvents.length === 0) {
      this.globalEvents = ticketmasterConcerts;
    }

    this.localEvents = ticketmasterConcerts.filter(
      concert =>
        concert.country === this.userCountry ||
        (concert.region && this.userCity && concert.region.toLowerCase().includes(this.userCity.toLowerCase())),
    );

    if (this.localEvents.length === 0) {
      this.localEvents = ticketmasterConcerts.slice(0, Math.min(5, ticketmasterConcerts.length));
    }
  }

  switchTab(tab: 'global' | 'local'): void {
    this.activeTab = tab;
    this.eventsToShow = tab === 'global' ? this.globalEvents : this.localEvents;

    if (tab === 'local' && this.userCountry && this.localEvents.length === 0) {
      this.fetchLocalConcerts();
    }
  }

  formatDate(date: Dayjs | null | undefined): string {
    if (!date) return 'TBA';

    try {
      return date.format('DD MMM YYYY, HH:mm');
    } catch (e) {
      if (typeof date === 'string') {
        try {
          return new Date(date).toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          });
        } catch {
          return String(date);
        }
      }
      return 'Invalid Date';
    }
  }
}
/* eslint-enable no-console */
