import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ILikedSongs, NewLikedSongs } from '../liked-songs.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILikedSongs for edit and NewLikedSongsFormGroupInput for create.
 */
type LikedSongsFormGroupInput = ILikedSongs | PartialWithRequiredKeyOf<NewLikedSongs>;

type LikedSongsFormDefaults = Pick<NewLikedSongs, 'id'>;

type LikedSongsFormGroupContent = {
  id: FormControl<ILikedSongs['id'] | NewLikedSongs['id']>;
  likeID: FormControl<ILikedSongs['likeID']>;
  song: FormControl<ILikedSongs['song']>;
};

export type LikedSongsFormGroup = FormGroup<LikedSongsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LikedSongsFormService {
  createLikedSongsFormGroup(likedSongs: LikedSongsFormGroupInput = { id: null }): LikedSongsFormGroup {
    const likedSongsRawValue = {
      ...this.getFormDefaults(),
      ...likedSongs,
    };
    return new FormGroup<LikedSongsFormGroupContent>({
      id: new FormControl(
        { value: likedSongsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      likeID: new FormControl(likedSongsRawValue.likeID, {
        validators: [Validators.required],
      }),
      song: new FormControl(likedSongsRawValue.song),
    });
  }

  getLikedSongs(form: LikedSongsFormGroup): ILikedSongs | NewLikedSongs {
    return form.getRawValue() as ILikedSongs | NewLikedSongs;
  }

  resetForm(form: LikedSongsFormGroup, likedSongs: LikedSongsFormGroupInput): void {
    const likedSongsRawValue = { ...this.getFormDefaults(), ...likedSongs };
    form.reset(
      {
        ...likedSongsRawValue,
        id: { value: likedSongsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LikedSongsFormDefaults {
    return {
      id: null,
    };
  }
}
