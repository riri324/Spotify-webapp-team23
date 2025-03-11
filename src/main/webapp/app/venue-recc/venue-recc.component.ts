import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'jhi-venue-recc',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './venue-recc.component.html',
  styleUrl: './venue-recc.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class VenueReccComponent implements OnInit {
  activeTab: 'global' | 'local' = 'global';

  globalEvents = [
    { artistId: 'ABC', venueName: 'Venue', datetime: '2025-03-10 19:00', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'ABC', venueName: 'Venue', datetime: '2025-03-10 19:00', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'ABC', venueName: 'Venue', datetime: '2025-03-10 19:00', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'ABC', venueName: 'Venue', datetime: '2025-03-10 19:00', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'ABC', venueName: 'Venue', datetime: '2025-03-10 19:00', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'ABC', venueName: 'Venue', datetime: '2025-03-10 19:00', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'ABC', venueName: 'Venue', datetime: '2025-03-10 19:00', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'ABC', venueName: 'Venue', datetime: '2025-03-10 19:00', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'ABC', venueName: 'Venue', datetime: '2025-03-10 19:00', thumbnail: '../../content/images/placeholder.jpg' },
  ];

  localEvents = [
    { artistId: 'XYZ', venueName: 'Venue', datetime: '2025-03-15 18:30', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'XYZ', venueName: 'Venue', datetime: '2025-03-15 18:30', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'XYZ', venueName: 'Venue', datetime: '2025-03-15 18:30', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'XYZ', venueName: 'Venue', datetime: '2025-03-15 18:30', thumbnail: '../../content/images/placeholder.jpg' },
    { artistId: 'XYZ', venueName: 'Venue', datetime: '2025-03-15 18:30', thumbnail: '../../content/images/placeholder.jpg' },
  ];

  eventsToShow = this.globalEvents;

  ngOnInit(): void {
    this.switchTab('global');
  }

  switchTab(tab: 'global' | 'local'): void {
    this.activeTab = tab;
    this.eventsToShow = tab === 'global' ? this.globalEvents : this.localEvents;
  }
}
