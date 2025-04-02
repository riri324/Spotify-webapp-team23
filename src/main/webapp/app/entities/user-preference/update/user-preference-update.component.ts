import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IUserPreference } from '../user-preference.model';
import { UserPreferenceService } from '../service/user-preference.service';
import { UserPreferenceFormGroup, UserPreferenceFormService } from './user-preference-form.service';

@Component({
  standalone: true,
  selector: 'jhi-user-preference-update',
  templateUrl: './user-preference-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UserPreferenceUpdateComponent implements OnInit {
  isSaving = false;
  userPreference: IUserPreference | null = null;

  usersSharedCollection: IUser[] = [];

  protected userPreferenceService = inject(UserPreferenceService);
  protected userPreferenceFormService = inject(UserPreferenceFormService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: UserPreferenceFormGroup = this.userPreferenceFormService.createUserPreferenceFormGroup();

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPreference }) => {
      this.userPreference = userPreference;
      if (userPreference) {
        this.updateForm(userPreference);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userPreference = this.userPreferenceFormService.getUserPreference(this.editForm);
    if (userPreference.id !== null) {
      this.subscribeToSaveResponse(this.userPreferenceService.update(userPreference));
    } else {
      this.subscribeToSaveResponse(this.userPreferenceService.create(userPreference));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserPreference>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userPreference: IUserPreference): void {
    this.userPreference = userPreference;
    this.userPreferenceFormService.resetForm(this.editForm, userPreference);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userPreference.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userPreference?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
