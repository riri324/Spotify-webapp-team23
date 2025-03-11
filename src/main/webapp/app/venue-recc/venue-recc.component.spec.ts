import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueReccComponent } from './venue-recc.component';

describe('VenueReccComponent', () => {
  let component: VenueReccComponent;
  let fixture: ComponentFixture<VenueReccComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VenueReccComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VenueReccComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
