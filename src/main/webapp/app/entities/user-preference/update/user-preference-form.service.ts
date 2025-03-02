import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IUserPreference, NewUserPreference } from '../user-preference.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserPreference for edit and NewUserPreferenceFormGroupInput for create.
 */
type UserPreferenceFormGroupInput = IUserPreference | PartialWithRequiredKeyOf<NewUserPreference>;

type UserPreferenceFormDefaults = Pick<NewUserPreference, 'id'>;

type UserPreferenceFormGroupContent = {
  id: FormControl<IUserPreference['id'] | NewUserPreference['id']>;
  favoriteGenre: FormControl<IUserPreference['favoriteGenre']>;
  musicPurpose: FormControl<IUserPreference['musicPurpose']>;
  musicMood: FormControl<IUserPreference['musicMood']>;
  vocalPreference: FormControl<IUserPreference['vocalPreference']>;
  listeningTime: FormControl<IUserPreference['listeningTime']>;
  listeningPattern: FormControl<IUserPreference['listeningPattern']>;
  songLength: FormControl<IUserPreference['songLength']>;
  lyricsImportance: FormControl<IUserPreference['lyricsImportance']>;
};

export type UserPreferenceFormGroup = FormGroup<UserPreferenceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserPreferenceFormService {
  createUserPreferenceFormGroup(userPreference: UserPreferenceFormGroupInput = { id: null }): UserPreferenceFormGroup {
    const userPreferenceRawValue = {
      ...this.getFormDefaults(),
      ...userPreference,
    };
    return new FormGroup<UserPreferenceFormGroupContent>({
      id: new FormControl(
        { value: userPreferenceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      favoriteGenre: new FormControl(userPreferenceRawValue.favoriteGenre),
      musicPurpose: new FormControl(userPreferenceRawValue.musicPurpose),
      musicMood: new FormControl(userPreferenceRawValue.musicMood),
      vocalPreference: new FormControl(userPreferenceRawValue.vocalPreference),
      listeningTime: new FormControl(userPreferenceRawValue.listeningTime),
      listeningPattern: new FormControl(userPreferenceRawValue.listeningPattern),
      songLength: new FormControl(userPreferenceRawValue.songLength),
      lyricsImportance: new FormControl(userPreferenceRawValue.lyricsImportance),
    });
  }

  getUserPreference(form: UserPreferenceFormGroup): IUserPreference | NewUserPreference {
    return form.getRawValue() as IUserPreference | NewUserPreference;
  }

  resetForm(form: UserPreferenceFormGroup, userPreference: UserPreferenceFormGroupInput): void {
    const userPreferenceRawValue = { ...this.getFormDefaults(), ...userPreference };
    form.reset(
      {
        ...userPreferenceRawValue,
        id: { value: userPreferenceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UserPreferenceFormDefaults {
    return {
      id: null,
    };
  }
}
