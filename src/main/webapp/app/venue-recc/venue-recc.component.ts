import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { TicketmasterService, Event } from './ticketmaster.service';
import { SpotifyService } from './spotify.service';
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
@Component({
  selector: 'jhi-venue-recc',
  standalone: true,
  imports: [CommonModule, RouterLink, HttpClientModule],
  templateUrl: './venue-recc.component.html',
  styleUrl: './venue-recc.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class VenueReccComponent implements OnInit {
  activeTab: 'global' | 'local' = 'global';
  globalEvents: Event[] = [];
  localEvents: Event[] = [];
  eventsToShow: Event[] = [];
  isLoading = true;
  isProd = false;
  spotifyToken: string | null = null;
  favoriteArtists: string[] = [];
  userLocation: { latitude: number; longitude: number } | null = null;
  locationCity = '';
  isGeolocationEnabled = false;

  sampleArtists = [
    'Taylor Swift',
    'Ed Sheeran',
    'Coldplay',
    'The Weeknd',
    'Billie Eilish',
    'Adele',
    'Harry Styles',
    'Dua Lipa',
    'Lewis Capaldi',
    'Arctic Monkeys',
    'Stormzy',
    'The 1975',
    'Sam Smith',
    'Elton John',
    'Little Mix',
    'Kasabian',
    'Florence + The Machine',
    'Muse',
    'Foals',
    'Bring Me The Horizon',
    'Bastille',
    'The Killers',
    'Oasis',
    'Blur',
    'Radiohead',
  ];

  constructor(
    private ticketmasterService: TicketmasterService,
    private spotifyService: SpotifyService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.isProd = !this.document.location.href.includes('localhost');
  }

  ngOnInit(): void {
    this.getUserLocation()
      .then(() => {
        this.handleAuthentication();
      })
      .catch(() => {
        this.handleAuthentication();
      });
  }

  handleAuthentication(): void {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get('access_token');

      if (token) {
        localStorage.setItem('spotify_token', token);
        window.history.replaceState({}, document.title, window.location.pathname);
        this.spotifyToken = token;
        this.loadFavoriteArtists();
      } else {
        this.loadEvents();
      }
    } else {
      this.spotifyToken = localStorage.getItem('spotify_token');
      this.loadFavoriteArtists();
    }
  }

  getUserLocation(): Promise<void> {
    return new Promise<void>(resolve => {
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        try {
          this.userLocation = JSON.parse(savedLocation);
          this.isGeolocationEnabled = true;
          resolve();
          return;
        } catch (e) {
          // Continue to try getting live location
        }
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            this.isGeolocationEnabled = true;

            localStorage.setItem('userLocation', JSON.stringify(this.userLocation));
            resolve();
          },
          error => {
            this.isGeolocationEnabled = false;
            this.userLocation = null;
            resolve();
          },
          {
            timeout: 8000,
            maximumAge: 0,
            enableHighAccuracy: true,
          },
        );
      } else {
        this.isGeolocationEnabled = false;
        this.userLocation = null;
        resolve();
      }
    });
  }

  loadFavoriteArtists(): void {
    if (!this.spotifyToken) {
      this.loadEvents();
      return;
    }

    this.isLoading = true;
    this.spotifyService.getTopArtists(this.spotifyToken).subscribe({
      next: artists => {
        if (artists.length > 0) {
          this.favoriteArtists = artists.map(artist => artist.name);

          this.loadEvents(this.favoriteArtists);
        } else {
          this.loadEvents(this.sampleArtists);
        }
      },
      error: () => {
        this.loadEvents(this.sampleArtists);
      },
    });
  }

  connectToSpotify(): void {
    const authUrl = this.spotifyService.getAuthUrl();
    this.document.location.href = authUrl;
  }

  disconnectSpotify(): void {
    localStorage.removeItem('spotify_token');
    this.spotifyToken = null;
    this.favoriteArtists = [];
    this.loadEvents(this.sampleArtists);
  }

  loadEvents(artists: string[] = this.sampleArtists): void {
    this.isLoading = true;

    this.ticketmasterService.getEventsForArtists(artists).subscribe({
      next: globalEvents => {
        const validGlobalEvents = globalEvents.filter(
          event => event.artistName && event.venueName && event.thumbnail && event.datetime !== 'Date TBD',
        );

        this.globalEvents = validGlobalEvents;

        this.switchTab('global');

        if (this.userLocation && this.isGeolocationEnabled) {
          this.loadNearbyEvents();
        } else {
          this.localEvents = [];
          this.isLoading = false;
        }
      },
      error: () => {
        this.globalEvents = [];
        this.localEvents = [];
        this.isLoading = false;
        this.switchTab('global');
      },
    });
  }

  loadNearbyEvents(): void {
    if (!this.userLocation) {
      this.localEvents = [];
      this.isLoading = false;
      return;
    }

    this.ticketmasterService
      .getNearbyEvents(
        this.userLocation.latitude,
        this.userLocation.longitude,
        100, // 100 mile radius
      )
      .subscribe({
        next: nearbyEvents => {
          const validEvents = nearbyEvents.filter(
            event => event.artistName && event.venueName && event.thumbnail && event.datetime !== 'Date TBD',
          );

          if (this.spotifyToken && this.favoriteArtists.length > 0) {
            const validNearbyEvents = validEvents.filter(event =>
              this.favoriteArtists.some(artist => event.artistName.toLowerCase().includes(artist.toLowerCase())),
            );
            this.localEvents = validNearbyEvents;
          } else {
            this.localEvents = validEvents;
          }

          if (validEvents.length > 0 && validEvents[0].city) {
            this.locationCity = validEvents[0].city;
          }

          this.isLoading = false;
        },
        error: () => {
          this.localEvents = [];
          this.isLoading = false;
        },
      });
  }

  switchTab(tab: 'global' | 'local'): void {
    this.activeTab = tab;
    this.eventsToShow = tab === 'global' ? this.globalEvents : this.localEvents;
  }
}
