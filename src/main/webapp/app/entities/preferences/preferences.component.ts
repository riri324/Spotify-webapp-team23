import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IUserPreference, NewUserPreference } from '.././user-preference/user-preference.model';
import { EntityArrayResponseType, UserPreferenceService } from '.././user-preference/service/user-preference.service';
import { UserPreferenceDeleteDialogComponent } from '.././user-preference/delete/user-preference-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-user-preference',
  templateUrl: './preferences.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
  styleUrls: ['./preferences.component.scss'],
})
export class UserPreferenceComponent implements OnInit {
  subscription: Subscription | null = null;
  userPreferences?: IUserPreference[];
  isLoading = false;
  sortState = sortStateSignal({});

  // 설문 관련 상태값
  questions = [
    { question: 'Which genre do you prefer?', options: ['Pop', 'Rock', 'Jazz', 'Hip-hop', 'Classical', 'Electronic'] },
    {
      question: 'What is your primary reason for listening to music?',
      options: ['Relaxation', 'Workout', 'Studying', 'Partying', 'Traveling'],
    },
    { question: 'What mood do you prefer in music?', options: ['Happy', 'Sad', 'Energetic', 'Calm', 'Romantic'] },
    { question: 'Do you prefer instrumental music or vocal music?', options: ['Instrumental', 'Vocal', 'No preference'] },
    { question: 'When do you usually listen to music?', options: ['Morning', 'Afternoon', 'Evening', 'Night', 'All day'] },
    { question: 'How do you usually listen to music?', options: ['Streaming', 'Downloaded songs', 'Radio', 'Live concerts'] },
    { question: 'What is your preferred song length?', options: ['Short (less than 3 min)', 'Medium (3-5 min)', 'Long (more than 5 min)'] },
    { question: 'How important are lyrics to you?', options: ['Very important', 'Somewhat important', 'Not important'] },
  ];

  currentQuestionIndex = 0;
  selectedPreferences: Record<string, string> = {};
  selectedOption: string | null = null;

  // 주입
  public readonly router = inject(Router);
  protected readonly userPreferenceService = inject(UserPreferenceService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (!this.userPreferences || this.userPreferences.length === 0) {
            this.load();
          }
        }),
      )
      .subscribe();
  }

  delete(userPreference: IUserPreference): void {
    const modalRef = this.modalService.open(UserPreferenceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userPreference = userPreference;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }
  selectPreference(answer: string): void {
    const currentQuestion = this.questions[this.currentQuestionIndex].question;
    this.selectedPreferences[currentQuestion] = answer;
    this.selectedOption = answer;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedOption = null;
    }
  }

  isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  savePreferences(): void {
    const data: NewUserPreference = {
      id: null,
      favoriteGenre: this.selectedPreferences['Which genre do you prefer?'],
      musicPurpose: this.selectedPreferences['What is your primary reason for listening to music?'],
      musicMood: this.selectedPreferences['What mood do you prefer in music?'],
      vocalPreference: this.selectedPreferences['Do you prefer instrumental music or vocal music?'],
      listeningTime: this.selectedPreferences['When do you usually listen to music?'],
      listeningPattern: this.selectedPreferences['How do you usually listen to music?'],
      songLength: this.selectedPreferences['What is your preferred song length?'],
      lyricsImportance: this.selectedPreferences['How important are lyrics to you?'],
    };

    this.userPreferenceService.create(data).subscribe({
      next: () => {
        alert('✅ Preferences saved!');
        this.load();
      },
      error() {
        alert('❌ Failed to save preferences.');
      },
    });
  }

  trackId = (item: IUserPreference): number => this.userPreferenceService.getUserPreferenceIdentifier(item);

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.userPreferences = this.refineData(dataFromBody);
  }

  protected refineData(data: IUserPreference[]): IUserPreference[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IUserPreference[] | null): IUserPreference[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.userPreferenceService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
