import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAlbum, NewAlbum } from '../album.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAlbum for edit and NewAlbumFormGroupInput for create.
 */
type AlbumFormGroupInput = IAlbum | PartialWithRequiredKeyOf<NewAlbum>;

type AlbumFormDefaults = Pick<NewAlbum, 'id'>;

type AlbumFormGroupContent = {
  id: FormControl<IAlbum['id'] | NewAlbum['id']>;
  albumID: FormControl<IAlbum['albumID']>;
  albumName: FormControl<IAlbum['albumName']>;
  numberOfSongs: FormControl<IAlbum['numberOfSongs']>;
  image: FormControl<IAlbum['image']>;
  imageContentType: FormControl<IAlbum['imageContentType']>;
  artist: FormControl<IAlbum['artist']>;
};

export type AlbumFormGroup = FormGroup<AlbumFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AlbumFormService {
  createAlbumFormGroup(album: AlbumFormGroupInput = { id: null }): AlbumFormGroup {
    const albumRawValue = {
      ...this.getFormDefaults(),
      ...album,
    };
    return new FormGroup<AlbumFormGroupContent>({
      id: new FormControl(
        { value: albumRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      albumID: new FormControl(albumRawValue.albumID, {
        validators: [Validators.required],
      }),
      albumName: new FormControl(albumRawValue.albumName, {
        validators: [Validators.required, Validators.maxLength(150)],
      }),
      numberOfSongs: new FormControl(albumRawValue.numberOfSongs, {
        validators: [Validators.required],
      }),
      image: new FormControl(albumRawValue.image),
      imageContentType: new FormControl(albumRawValue.imageContentType),
      artist: new FormControl(albumRawValue.artist),
    });
  }

  getAlbum(form: AlbumFormGroup): IAlbum | NewAlbum {
    return form.getRawValue() as IAlbum | NewAlbum;
  }

  resetForm(form: AlbumFormGroup, album: AlbumFormGroupInput): void {
    const albumRawValue = { ...this.getFormDefaults(), ...album };
    form.reset(
      {
        ...albumRawValue,
        id: { value: albumRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AlbumFormDefaults {
    return {
      id: null,
    };
  }
}
