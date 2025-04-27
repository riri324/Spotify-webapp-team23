import { Component, OnInit, inject, signal, HostListener, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { VERSION } from 'app/app.constants';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import NavbarItem from './navbar-item.model';

@Component({
  standalone: true,
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterModule, SharedModule, HasAnyAuthorityDirective],
})
export default class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = signal(true);
  openAPIEnabled?: boolean;
  version = '';
  account = inject(AccountService).trackCurrentAccount();
  entitiesNavbarItems: NavbarItem[] = [];

  private readonly loginService = inject(LoginService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  constructor() {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed.set(true);
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed.update(isNavbarCollapsed => !isNavbarCollapsed);
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLInputElement) {
      return;
    }

    const target = event.target as HTMLElement;

    // Handle keyboard navigation
    switch (event.key) {
      case 'ArrowLeft':
        this.navigateSiblings(target, 'previous');
        event.preventDefault();
        break;

      case 'ArrowRight':
        this.navigateSiblings(target, 'next');
        event.preventDefault();
        break;

      case 'ArrowDown':
        if (this.isDropdownToggle(target)) {
          const isExpanded = target.getAttribute('aria-expanded') === 'true';

          if (!isExpanded) {
            target.click();
          }
          setTimeout(() => {
            const dropdown = this.findDropdownMenu(target);
            const firstItem = dropdown?.querySelector('a.dropdown-item') as HTMLElement;
            firstItem.focus();
          }, 10);

          event.preventDefault();
        } else if (this.isInDropdown(target)) {
          const nextItem = target.parentElement?.nextElementSibling?.querySelector('a') as HTMLElement;
          nextItem.focus();
          event.preventDefault();
        }
        break;

      case 'ArrowUp':
        if (this.isInDropdown(target)) {
          const prevItem = target.parentElement?.previousElementSibling?.querySelector('a') as HTMLElement;
          // eslint-disable-next-line
          if (prevItem) {
            prevItem.focus();
          } else {
            const toggle = this.findParentDropdownToggle(target);
            toggle?.focus();
            toggle?.click();
          }
          event.preventDefault();
        }
        break;

      case 'Escape':
        if (this.isInDropdown(target)) {
          const toggle = this.findParentDropdownToggle(target);
          if (toggle) {
            toggle.click();
            toggle.focus();
          }
          event.preventDefault();
        }
        break;

      case 'Enter':
      case ' ':
        if (this.isDropdownToggle(target) && event.key === ' ') {
          target.click();
          event.preventDefault();
        }
        break;
    }
  }

  private navigateSiblings(element: HTMLElement, direction: 'next' | 'previous'): void {
    const isTopLevel = !this.isInDropdown(element);

    if (isTopLevel) {
      const allNavItems = Array.from(this.elementRef.nativeElement.querySelectorAll('.navbar-nav > li > a'));
      const currentIndex = allNavItems.indexOf(element);

      if (currentIndex !== -1) {
        const nextIndex =
          direction === 'next' ? (currentIndex + 1) % allNavItems.length : (currentIndex - 1 + allNavItems.length) % allNavItems.length;

        (allNavItems[nextIndex] as HTMLElement).focus();
      } else {
        (allNavItems[0] as HTMLElement).focus();
      }
    }
  }

  private isDropdownToggle(element: HTMLElement): boolean {
    return element.classList.contains('dropdown-toggle');
  }

  private isInDropdown(element: HTMLElement): boolean {
    return element.classList.contains('dropdown-item');
  }

  private findDropdownMenu(toggleElement: HTMLElement): HTMLElement | null {
    const parentLi = toggleElement.closest('li');
    return parentLi?.querySelector('.dropdown-menu') ?? null;
  }

  private findParentDropdownToggle(element: HTMLElement): HTMLElement | null {
    const dropdownMenu = element.closest('.dropdown-menu');
    if (dropdownMenu) {
      const parentLi = dropdownMenu.closest('li');
      return parentLi?.querySelector('.dropdown-toggle') ?? null;
    }
    return null;
  }
}
