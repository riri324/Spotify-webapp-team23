import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEvent, NewEvent } from '../event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvent for edit and NewEventFormGroupInput for create.
 */
type EventFormGroupInput = IEvent | PartialWithRequiredKeyOf<NewEvent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IEvent | NewEvent> = Omit<T, 'datetime'> & {
  datetime?: string | null;
};

type EventFormRawValue = FormValueOf<IEvent>;

type NewEventFormRawValue = FormValueOf<NewEvent>;

type EventFormDefaults = Pick<NewEvent, 'id' | 'datetime'>;

type EventFormGroupContent = {
  id: FormControl<EventFormRawValue['id'] | NewEvent['id']>;
  eventID: FormControl<EventFormRawValue['eventID']>;
  datetime: FormControl<EventFormRawValue['datetime']>;
  description: FormControl<EventFormRawValue['description']>;
  title: FormControl<EventFormRawValue['title']>;
  venueName: FormControl<EventFormRawValue['venueName']>;
  city: FormControl<EventFormRawValue['city']>;
  region: FormControl<EventFormRawValue['region']>;
  country: FormControl<EventFormRawValue['country']>;
  artist: FormControl<EventFormRawValue['artist']>;
};

export type EventFormGroup = FormGroup<EventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventFormService {
  createEventFormGroup(event: EventFormGroupInput = { id: null }): EventFormGroup {
    const eventRawValue = this.convertEventToEventRawValue({
      ...this.getFormDefaults(),
      ...event,
    });
    return new FormGroup<EventFormGroupContent>({
      id: new FormControl(
        { value: eventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      eventID: new FormControl(eventRawValue.eventID, {
        validators: [Validators.required],
      }),
      datetime: new FormControl(eventRawValue.datetime, {
        validators: [Validators.required],
      }),
      description: new FormControl(eventRawValue.description, {
        validators: [Validators.maxLength(500)],
      }),
      title: new FormControl(eventRawValue.title, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      venueName: new FormControl(eventRawValue.venueName, {
        validators: [Validators.required, Validators.maxLength(100)],
      }),
      city: new FormControl(eventRawValue.city, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      region: new FormControl(eventRawValue.region, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      country: new FormControl(eventRawValue.country, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      artist: new FormControl(eventRawValue.artist),
    });
  }

  getEvent(form: EventFormGroup): IEvent | NewEvent {
    return this.convertEventRawValueToEvent(form.getRawValue() as EventFormRawValue | NewEventFormRawValue);
  }

  resetForm(form: EventFormGroup, event: EventFormGroupInput): void {
    const eventRawValue = this.convertEventToEventRawValue({ ...this.getFormDefaults(), ...event });
    form.reset(
      {
        ...eventRawValue,
        id: { value: eventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EventFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      datetime: currentTime,
    };
  }

  private convertEventRawValueToEvent(rawEvent: EventFormRawValue | NewEventFormRawValue): IEvent | NewEvent {
    return {
      ...rawEvent,
      datetime: dayjs(rawEvent.datetime, DATE_TIME_FORMAT),
    };
  }

  private convertEventToEventRawValue(
    event: IEvent | (Partial<NewEvent> & EventFormDefaults),
  ): EventFormRawValue | PartialWithRequiredKeyOf<NewEventFormRawValue> {
    return {
      ...event,
      datetime: event.datetime ? event.datetime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
