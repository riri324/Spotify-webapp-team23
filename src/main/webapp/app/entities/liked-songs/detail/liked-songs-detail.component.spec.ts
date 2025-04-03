import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { LikedSongsDetailComponent } from './liked-songs-detail.component';

describe('LikedSongs Management Detail Component', () => {
  let comp: LikedSongsDetailComponent;
  let fixture: ComponentFixture<LikedSongsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikedSongsDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./liked-songs-detail.component').then(m => m.LikedSongsDetailComponent),
              resolve: { likedSongs: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(LikedSongsDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikedSongsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load likedSongs on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', LikedSongsDetailComponent);

      // THEN
      expect(instance.likedSongs()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
