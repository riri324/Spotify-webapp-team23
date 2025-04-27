import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ISong, NewSong } from '../song.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISong for edit and NewSongFormGroupInput for create.
 */
type SongFormGroupInput = ISong | PartialWithRequiredKeyOf<NewSong>;

type SongFormDefaults = Pick<NewSong, 'id' | 'playlists' | 'listeningHistories'>;

type SongFormGroupContent = {
  id: FormControl<ISong['id'] | NewSong['id']>;
  songId: FormControl<ISong['songId']>;
  trackName: FormControl<ISong['trackName']>;
  danceability: FormControl<ISong['danceability']>;
  energy: FormControl<ISong['energy']>;
  speechiness: FormControl<ISong['speechiness']>;
  acousticness: FormControl<ISong['acousticness']>;
  instrumentalness: FormControl<ISong['instrumentalness']>;
  liveness: FormControl<ISong['liveness']>;
  valence: FormControl<ISong['valence']>;
  tempo: FormControl<ISong['tempo']>;
  album: FormControl<ISong['album']>;
  genre: FormControl<ISong['genre']>;
  artist: FormControl<ISong['artist']>;
  playlists: FormControl<ISong['playlists']>;
  listeningHistories: FormControl<ISong['listeningHistories']>;
};

export type SongFormGroup = FormGroup<SongFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SongFormService {
  createSongFormGroup(song: SongFormGroupInput = { id: null }): SongFormGroup {
    const songRawValue = {
      ...this.getFormDefaults(),
      ...song,
    };
    return new FormGroup<SongFormGroupContent>({
      id: new FormControl(
        { value: songRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      songId: new FormControl(songRawValue.songId, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      trackName: new FormControl(songRawValue.trackName, {
        validators: [Validators.required, Validators.maxLength(150)],
      }),
      danceability: new FormControl(songRawValue.danceability),
      energy: new FormControl(songRawValue.energy),
      speechiness: new FormControl(songRawValue.speechiness),
      acousticness: new FormControl(songRawValue.acousticness),
      instrumentalness: new FormControl(songRawValue.instrumentalness),
      liveness: new FormControl(songRawValue.liveness),
      valence: new FormControl(songRawValue.valence),
      tempo: new FormControl(songRawValue.tempo),
      album: new FormControl(songRawValue.album),
      genre: new FormControl(songRawValue.genre),
      artist: new FormControl(songRawValue.artist),
      playlists: new FormControl(songRawValue.playlists ?? []),
      listeningHistories: new FormControl(songRawValue.listeningHistories ?? []),
    });
  }

  getSong(form: SongFormGroup): ISong | NewSong {
    return form.getRawValue() as ISong | NewSong;
  }

  resetForm(form: SongFormGroup, song: SongFormGroupInput): void {
    const songRawValue = { ...this.getFormDefaults(), ...song };
    form.reset(
      {
        ...songRawValue,
        id: { value: songRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SongFormDefaults {
    return {
      id: null,
      playlists: [],
      listeningHistories: [],
    };
  }
}
