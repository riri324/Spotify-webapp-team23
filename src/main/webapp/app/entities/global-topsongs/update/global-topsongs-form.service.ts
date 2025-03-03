import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IGlobalTopsongs, NewGlobalTopsongs } from '../global-topsongs.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGlobalTopsongs for edit and NewGlobalTopsongsFormGroupInput for create.
 */
type GlobalTopsongsFormGroupInput = IGlobalTopsongs | PartialWithRequiredKeyOf<NewGlobalTopsongs>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IGlobalTopsongs | NewGlobalTopsongs> = Omit<T, 'monthYear'> & {
  monthYear?: string | null;
};

type GlobalTopsongsFormRawValue = FormValueOf<IGlobalTopsongs>;

type NewGlobalTopsongsFormRawValue = FormValueOf<NewGlobalTopsongs>;

type GlobalTopsongsFormDefaults = Pick<NewGlobalTopsongs, 'id' | 'monthYear'>;

type GlobalTopsongsFormGroupContent = {
  id: FormControl<GlobalTopsongsFormRawValue['id'] | NewGlobalTopsongs['id']>;
  songTitle: FormControl<GlobalTopsongsFormRawValue['songTitle']>;
  artistName: FormControl<GlobalTopsongsFormRawValue['artistName']>;
  playCount: FormControl<GlobalTopsongsFormRawValue['playCount']>;
  monthYear: FormControl<GlobalTopsongsFormRawValue['monthYear']>;
  year: FormControl<GlobalTopsongsFormRawValue['year']>;
};

export type GlobalTopsongsFormGroup = FormGroup<GlobalTopsongsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GlobalTopsongsFormService {
  createGlobalTopsongsFormGroup(globalTopsongs: GlobalTopsongsFormGroupInput = { id: null }): GlobalTopsongsFormGroup {
    const globalTopsongsRawValue = this.convertGlobalTopsongsToGlobalTopsongsRawValue({
      ...this.getFormDefaults(),
      ...globalTopsongs,
    });
    return new FormGroup<GlobalTopsongsFormGroupContent>({
      id: new FormControl(
        { value: globalTopsongsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      songTitle: new FormControl(globalTopsongsRawValue.songTitle, {
        validators: [Validators.required],
      }),
      artistName: new FormControl(globalTopsongsRawValue.artistName, {
        validators: [Validators.required],
      }),
      playCount: new FormControl(globalTopsongsRawValue.playCount, {
        validators: [Validators.required, Validators.min(0)],
      }),
      monthYear: new FormControl(globalTopsongsRawValue.monthYear, {
        validators: [Validators.required],
      }),
      year: new FormControl(globalTopsongsRawValue.year, {
        validators: [Validators.required, Validators.min(2000), Validators.max(2100)],
      }),
    });
  }

  getGlobalTopsongs(form: GlobalTopsongsFormGroup): IGlobalTopsongs | NewGlobalTopsongs {
    return this.convertGlobalTopsongsRawValueToGlobalTopsongs(
      form.getRawValue() as GlobalTopsongsFormRawValue | NewGlobalTopsongsFormRawValue,
    );
  }

  resetForm(form: GlobalTopsongsFormGroup, globalTopsongs: GlobalTopsongsFormGroupInput): void {
    const globalTopsongsRawValue = this.convertGlobalTopsongsToGlobalTopsongsRawValue({ ...this.getFormDefaults(), ...globalTopsongs });
    form.reset(
      {
        ...globalTopsongsRawValue,
        id: { value: globalTopsongsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): GlobalTopsongsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      monthYear: currentTime,
    };
  }

  private convertGlobalTopsongsRawValueToGlobalTopsongs(
    rawGlobalTopsongs: GlobalTopsongsFormRawValue | NewGlobalTopsongsFormRawValue,
  ): IGlobalTopsongs | NewGlobalTopsongs {
    return {
      ...rawGlobalTopsongs,
      monthYear: dayjs(rawGlobalTopsongs.monthYear, DATE_TIME_FORMAT),
    };
  }

  private convertGlobalTopsongsToGlobalTopsongsRawValue(
    globalTopsongs: IGlobalTopsongs | (Partial<NewGlobalTopsongs> & GlobalTopsongsFormDefaults),
  ): GlobalTopsongsFormRawValue | PartialWithRequiredKeyOf<NewGlobalTopsongsFormRawValue> {
    return {
      ...globalTopsongs,
      monthYear: globalTopsongs.monthYear ? globalTopsongs.monthYear.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
