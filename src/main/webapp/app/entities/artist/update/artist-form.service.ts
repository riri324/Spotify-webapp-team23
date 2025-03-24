import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IArtist, NewArtist } from '../artist.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IArtist for edit and NewArtistFormGroupInput for create.
 */
type ArtistFormGroupInput = IArtist | PartialWithRequiredKeyOf<NewArtist>;

type ArtistFormDefaults = Pick<NewArtist, 'id'>;

type ArtistFormGroupContent = {
  id: FormControl<IArtist['id'] | NewArtist['id']>;
  artistName: FormControl<IArtist['artistName']>;
  followers: FormControl<IArtist['followers']>;
  image: FormControl<IArtist['image']>;
  imageContentType: FormControl<IArtist['imageContentType']>;
};

export type ArtistFormGroup = FormGroup<ArtistFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ArtistFormService {
  createArtistFormGroup(artist: ArtistFormGroupInput = { id: null }): ArtistFormGroup {
    const artistRawValue = {
      ...this.getFormDefaults(),
      ...artist,
    };
    return new FormGroup<ArtistFormGroupContent>({
      id: new FormControl(
        { value: artistRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      artistName: new FormControl(artistRawValue.artistName, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      followers: new FormControl(artistRawValue.followers, {
        validators: [Validators.required],
      }),
      image: new FormControl(artistRawValue.image),
      imageContentType: new FormControl(artistRawValue.imageContentType),
    });
  }

  getArtist(form: ArtistFormGroup): IArtist | NewArtist {
    return form.getRawValue() as IArtist | NewArtist;
  }

  resetForm(form: ArtistFormGroup, artist: ArtistFormGroupInput): void {
    const artistRawValue = { ...this.getFormDefaults(), ...artist };
    form.reset(
      {
        ...artistRawValue,
        id: { value: artistRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ArtistFormDefaults {
    return {
      id: null,
    };
  }
}
