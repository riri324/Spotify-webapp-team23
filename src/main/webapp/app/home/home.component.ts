import { Component, OnDestroy, OnInit, inject, signal, AfterViewInit, ElementRef } from '@angular/core';
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
export default class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private elementRef = inject(ElementRef);
  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  account = signal<Account | null>(null);
  activeSection: 'playlists' | 'songs' | 'features' = 'playlists';
  focusedIndex = 0;
  lastHorizontalSection: 'playlists' | 'songs' = 'playlists';

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
      label: 'Concerts',
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

  guestFeatures = [
    {
      label: 'Concerts',
      route: '/venue-recommendations',
      description: 'Find your local events that match your vibes',
      icon: '📍',
    },
    {
      label: 'AI Song Recommender',
      route: '/recommender',
      description: 'Get personalized song recommendations from our AI',
      icon: '🤖',
    },
  ];

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => {
        this.account.set(account);
        this.resetFocusState();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.focusElement(this.activeSection, this.focusedIndex), 0);
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetFocusState(): void {
    this.activeSection = 'playlists';
    this.focusedIndex = 0;
    this.lastHorizontalSection = 'playlists';
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  handleKeyDown(event: KeyboardEvent): void {
    let handled = false;
    const currentFeatures = this.getLinksBySection('features');
    const maxFeatureIndex = currentFeatures.length - 1;

    switch (event.key) {
      case 'ArrowDown':
        if (this.activeSection === 'playlists' || this.activeSection === 'songs') {
          this.lastHorizontalSection = this.activeSection;
          this.activeSection = 'features';
          this.focusedIndex = 0;
          this.focusElement(this.activeSection, this.focusedIndex);
          handled = true;
        } else if (this.activeSection === 'features') {
          this.focusedIndex = this.focusedIndex >= maxFeatureIndex ? 0 : this.focusedIndex + 1;
          this.focusElement(this.activeSection, this.focusedIndex);
          handled = true;
        }
        break;

      case 'ArrowUp':
        if (this.activeSection === 'features') {
          if (this.focusedIndex === 0) {
            this.activeSection = this.lastHorizontalSection;
            this.focusedIndex = 0;
            this.focusElement(this.activeSection, this.focusedIndex);
            handled = true;
          } else {
            this.focusedIndex = this.focusedIndex - 1;
            this.focusElement(this.activeSection, this.focusedIndex);
            handled = true;
          }
        } else if (this.activeSection === 'playlists' || this.activeSection === 'songs') {
          const navbarLink = document.querySelector('nav a');
          if (navbarLink instanceof HTMLElement) {
            navbarLink.focus();
            handled = true;
          }
        }
        break;

      case 'ArrowLeft':
        if (this.activeSection === 'songs') {
          this.activeSection = 'playlists';
          this.focusedIndex = 0;
          this.focusElement(this.activeSection, this.focusedIndex);
          handled = true;
        }
        break;

      case 'ArrowRight':
        if (this.activeSection === 'playlists') {
          this.activeSection = 'songs';
          this.focusedIndex = 0;
          this.focusElement(this.activeSection, this.focusedIndex);
          handled = true;
        }
        break;

      case 'Enter':
      case ' ':
        const links = this.getLinksBySection(this.activeSection);
        if (this.activeSection === 'features') {
          if (links[this.focusedIndex]) {
            this.navigateTo(links[this.focusedIndex].route);
            handled = true;
          }
        } else if (links.length > 0) {
          this.navigateTo(links[0].route);
          handled = true;
        }
        break;
      case 'Tab':
        // Default Tab Behaviour
        break;
    }

    if (handled) {
      event.preventDefault();
    }
  }

  getLinksBySection(section: 'playlists' | 'songs' | 'features'): any[] {
    switch (section) {
      case 'features':
        return this.account() ? this.featuresLinks : this.guestFeatures;
      case 'playlists':
        return [{ route: '/playlist', id: 'playlist-link' }];
      case 'songs':
        return [{ route: '/song', id: 'song-link' }];
      default:
        return []; // Should not happen
    }
  }

  focusElement(section: 'playlists' | 'songs' | 'features', index: number): void {
    let element: HTMLElement | null = null;
    const host = this.elementRef.nativeElement;

    try {
      if (section === 'features') {
        element = host.querySelector(`[data-section="features"] [data-index="${index}"]`);
      } else {
        const linkData = this.getLinksBySection(section);
        if (linkData.length > 0) {
          const elementId = linkData[0].id;
          element = host.querySelector(`#${elementId}`);
        }
      }

      if (element) {
        element.focus();
        this.activeSection = section;
        if (section === 'features') {
          this.focusedIndex = index;
        } else {
          this.focusedIndex = 0;
        }
      } else {
        console.warn(`Could not find element to focus for section: ${section}, index: ${index}`);
      }
    } catch (error) {
      console.error("Error focusing element:", error);
    }
  }

  updateFocusState(section: 'playlists' | 'songs' | 'features', index: number = 0): void {
    this.activeSection = section;
    if (section === 'features') {
      this.focusedIndex = index;
    } else {
      this.focusedIndex = 0;
      this.lastHorizontalSection = section;
    }
  }


  navigateTo(route: string): void {
    if(route){
      this.router.navigate([route]);
    }
  }
}
