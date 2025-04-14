import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { GlobalTopsongsDetailComponent } from './global-topsongs-detail.component';

describe('GlobalTopsongs Management Detail Component', () => {
  let comp: GlobalTopsongsDetailComponent;
  let fixture: ComponentFixture<GlobalTopsongsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalTopsongsDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./global-topsongs-detail.component').then(m => m.GlobalTopsongsDetailComponent),
              resolve: { globalTopsongs: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GlobalTopsongsDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalTopsongsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load globalTopsongs on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GlobalTopsongsDetailComponent);

      // THEN
      expect(instance.globalTopsongs()).toEqual(expect.objectContaining({ id: 123 }));
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
