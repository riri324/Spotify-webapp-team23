import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IConcert, NewConcert } from '../concert.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConcert for edit and NewConcertFormGroupInput for create.
 */
type ConcertFormGroupInput = IConcert | PartialWithRequiredKeyOf<NewConcert>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IConcert | NewConcert> = Omit<T, 'eventDate'> & {
  eventDate?: string | null;
};

type ConcertFormRawValue = FormValueOf<IConcert>;

type NewConcertFormRawValue = FormValueOf<NewConcert>;

type ConcertFormDefaults = Pick<NewConcert, 'id' | 'eventDate'>;

type ConcertFormGroupContent = {
  id: FormControl<ConcertFormRawValue['id'] | NewConcert['id']>;
  artistName: FormControl<ConcertFormRawValue['artistName']>;
  venueName: FormControl<ConcertFormRawValue['venueName']>;
  country: FormControl<ConcertFormRawValue['country']>;
  region: FormControl<ConcertFormRawValue['region']>;
  eventDate: FormControl<ConcertFormRawValue['eventDate']>;
  ticketmasterEventId: FormControl<ConcertFormRawValue['ticketmasterEventId']>;
  imageUrl: FormControl<ConcertFormRawValue['imageUrl']>;
  externalUrl: FormControl<ConcertFormRawValue['externalUrl']>;
};

export type ConcertFormGroup = FormGroup<ConcertFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConcertFormService {
  createConcertFormGroup(concert: ConcertFormGroupInput = { id: null }): ConcertFormGroup {
    const concertRawValue = this.convertConcertToConcertRawValue({
      ...this.getFormDefaults(),
      ...concert,
    });
    return new FormGroup<ConcertFormGroupContent>({
      id: new FormControl(
        { value: concertRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      artistName: new FormControl(concertRawValue.artistName, {
        validators: [Validators.required],
      }),
      venueName: new FormControl(concertRawValue.venueName, {
        validators: [Validators.required],
      }),
      country: new FormControl(concertRawValue.country, {
        validators: [Validators.required],
      }),
      region: new FormControl(concertRawValue.region),
      eventDate: new FormControl(concertRawValue.eventDate, {
        validators: [Validators.required],
      }),
      ticketmasterEventId: new FormControl(concertRawValue.ticketmasterEventId),
      imageUrl: new FormControl(concertRawValue.imageUrl),
      externalUrl: new FormControl(concertRawValue.externalUrl),
    });
  }

  getConcert(form: ConcertFormGroup): IConcert | NewConcert {
    return this.convertConcertRawValueToConcert(form.getRawValue() as ConcertFormRawValue | NewConcertFormRawValue);
  }

  resetForm(form: ConcertFormGroup, concert: ConcertFormGroupInput): void {
    const concertRawValue = this.convertConcertToConcertRawValue({ ...this.getFormDefaults(), ...concert });
    form.reset(
      {
        ...concertRawValue,
        id: { value: concertRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ConcertFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      eventDate: currentTime,
    };
  }

  private convertConcertRawValueToConcert(rawConcert: ConcertFormRawValue | NewConcertFormRawValue): IConcert | NewConcert {
    return {
      ...rawConcert,
      eventDate: dayjs(rawConcert.eventDate, DATE_TIME_FORMAT),
    };
  }

  private convertConcertToConcertRawValue(
    concert: IConcert | (Partial<NewConcert> & ConcertFormDefaults),
  ): ConcertFormRawValue | PartialWithRequiredKeyOf<NewConcertFormRawValue> {
    return {
      ...concert,
      eventDate: concert.eventDate ? concert.eventDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
