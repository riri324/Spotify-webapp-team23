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
  // Navigation links for logged-in users
  navLinks = [{ label: 'AI Song Recommender', route: '/recommender' }];

  focusedIndex = 0;
  account = signal<Account | null>(null);
  private readonly destroy$ = new Subject<void>();

  private readonly accountService = inject(AccountService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => this.account.set(account));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  // Handle keyboard navigation
  handleKeyDown(event: KeyboardEvent): void {
    const max = this.navLinks.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        this.focusedIndex = this.focusedIndex + 1 > max ? 0 : this.focusedIndex + 1;
        this.focusElement(this.focusedIndex);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.focusedIndex = this.focusedIndex - 1 < 0 ? max : this.focusedIndex - 1;
        this.focusElement(this.focusedIndex);
        event.preventDefault();
        break;
      case 'Enter':
        this.navigateTo(this.navLinks[this.focusedIndex].route);
        break;
    }
  }

  focusElement(index: number): void {
    const el = document.querySelector(`[data-index="${index}"]`) as HTMLElement;
    el.focus();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
