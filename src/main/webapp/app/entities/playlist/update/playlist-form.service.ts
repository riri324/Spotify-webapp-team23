import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPlaylist, NewPlaylist } from '../playlist.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlaylist for edit and NewPlaylistFormGroupInput for create.
 */
type PlaylistFormGroupInput = IPlaylist | PartialWithRequiredKeyOf<NewPlaylist>;

type PlaylistFormDefaults = Pick<NewPlaylist, 'id' | 'isPublic' | 'songs'>;

type PlaylistFormGroupContent = {
  id: FormControl<IPlaylist['id'] | NewPlaylist['id']>;
  playlistID: FormControl<IPlaylist['playlistID']>;
  name: FormControl<IPlaylist['name']>;
  description: FormControl<IPlaylist['description']>;
  isPublic: FormControl<IPlaylist['isPublic']>;
  songs: FormControl<IPlaylist['songs']>;
  user: FormControl<IPlaylist['user']>;
};

export type PlaylistFormGroup = FormGroup<PlaylistFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlaylistFormService {
  createPlaylistFormGroup(playlist: PlaylistFormGroupInput = { id: null }): PlaylistFormGroup {
    const playlistRawValue = {
      ...this.getFormDefaults(),
      ...playlist,
    };
    return new FormGroup<PlaylistFormGroupContent>({
      id: new FormControl(
        { value: playlistRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      playlistID: new FormControl(playlistRawValue.playlistID, {
        validators: [Validators.required],
      }),
      name: new FormControl(playlistRawValue.name, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      description: new FormControl(playlistRawValue.description, {
        validators: [Validators.maxLength(100)],
      }),
      isPublic: new FormControl(playlistRawValue.isPublic, {
        validators: [Validators.required],
      }),
      songs: new FormControl(playlistRawValue.songs ?? []),
      user: new FormControl(playlistRawValue.user, {
        validators: [Validators.required],
      }),
    });
  }

  getPlaylist(form: PlaylistFormGroup): IPlaylist | NewPlaylist {
    return form.getRawValue() as IPlaylist | NewPlaylist;
  }

  resetForm(form: PlaylistFormGroup, playlist: PlaylistFormGroupInput): void {
    const playlistRawValue = { ...this.getFormDefaults(), ...playlist };
    form.reset(
      {
        ...playlistRawValue,
        id: { value: playlistRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PlaylistFormDefaults {
    return {
      id: null,
      isPublic: false,
      songs: [],
    };
  }
}
