import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [SharedModule, RouterModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  // Track active section for better keyboard navigation
  activeSection: 'playlists' | 'songs' | 'features' = 'playlists';
  focusedIndex = 0;
  account = signal<Account | null>(null);

  // Features links for logged-in users
  featuresLinks = [
    {
      label: 'Create a Playlist now',
      route: '/playlist/new',
      description: 'Start a new collection of your favorite songs',
      icon: '➕',
    },
    {
      label: 'User Song Recommender',
      route: '/recommend',
      description: 'Recommend a song to a friend?',
      icon: '🎵',
    },
    {
      label: 'AI Song Recommender',
      route: '/recommender',
      description: 'Get personalized song recommendations from our AI',
      icon: '🤖',
    },
    {
      label: 'Global Top Songs',
      route: '/topsongs',
      description: 'Discover the top global songs and artists currently!',
      icon: '📊',
    },
    {
      label: 'Venue Recommendations',
      route: '/venue-recommendations',
      description: 'Find your local events that match your vibes',
      icon: '📍',
    },
    {
      label: 'Messages',
      route: '/messages',
      description: '💬 Check out your messages! 💬',
      icon: '💬',
    },
    {
      label: 'Preferences',
      route: '/preferences',
      description: 'Customize your app experience',
      icon: '🤔',
    },
  ];

  // Features for guests
  guestFeatures = [
    {
      label: 'Global Top Songs',
      route: '/topsongs',
      description: 'Discover the top global songs and artists currently!',
      icon: '📊',
    },
  ];

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account.set(account);
        // Reset focus when login state changes
        this.focusedIndex = 0;
        this.activeSection = 'playlists';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  // Updated keyboard navigation with sections
  handleKeyDown(event: KeyboardEvent, section: string): void {
    this.activeSection = section as any;
    const links = this.getLinksBySection(section);
    const max = links.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        this.focusedIndex = this.focusedIndex + 1 > max ? 0 : this.focusedIndex + 1;
        this.focusElement(section, this.focusedIndex);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.focusedIndex = this.focusedIndex - 1 < 0 ? max : this.focusedIndex - 1;
        this.focusElement(section, this.focusedIndex);
        event.preventDefault();
        break;
      case 'Enter':
        this.navigateTo(links[this.focusedIndex].route);
        break;
      case 'Tab':
        // Allow tab navigation without interference
        break;
    }
  }

  getLinksBySection(section: string): any[] {
    switch (section) {
      case 'features':
        return this.account() ? this.featuresLinks : this.guestFeatures;
      case 'playlists':
      case 'songs':
      default:
        return [{ route: section === 'playlists' ? '/playlist' : '/song' }];
    }
  }

  focusElement(section: string, index: number): void {
    const selector = section === 'features' ? `[data-index="${index}"]` : `.${section}-container .list-group-item`;
    const el = document.querySelector(selector) as HTMLElement;
    el.focus();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
