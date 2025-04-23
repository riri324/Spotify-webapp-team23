import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IListeningHistory, NewListeningHistory } from '../listening-history.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IListeningHistory for edit and NewListeningHistoryFormGroupInput for create.
 */
type ListeningHistoryFormGroupInput = IListeningHistory | PartialWithRequiredKeyOf<NewListeningHistory>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IListeningHistory | NewListeningHistory> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type ListeningHistoryFormRawValue = FormValueOf<IListeningHistory>;

type NewListeningHistoryFormRawValue = FormValueOf<NewListeningHistory>;

type ListeningHistoryFormDefaults = Pick<NewListeningHistory, 'id' | 'timestamp' | 'songs'>;

type ListeningHistoryFormGroupContent = {
  id: FormControl<ListeningHistoryFormRawValue['id'] | NewListeningHistory['id']>;
  historyID: FormControl<ListeningHistoryFormRawValue['historyID']>;
  timestamp: FormControl<ListeningHistoryFormRawValue['timestamp']>;
  songs: FormControl<ListeningHistoryFormRawValue['songs']>;
};

export type ListeningHistoryFormGroup = FormGroup<ListeningHistoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ListeningHistoryFormService {
  createListeningHistoryFormGroup(listeningHistory: ListeningHistoryFormGroupInput = { id: null }): ListeningHistoryFormGroup {
    const listeningHistoryRawValue = this.convertListeningHistoryToListeningHistoryRawValue({
      ...this.getFormDefaults(),
      ...listeningHistory,
    });
    return new FormGroup<ListeningHistoryFormGroupContent>({
      id: new FormControl(
        { value: listeningHistoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      historyID: new FormControl(listeningHistoryRawValue.historyID, {
        validators: [Validators.required],
      }),
      timestamp: new FormControl(listeningHistoryRawValue.timestamp, {
        validators: [Validators.required],
      }),
      songs: new FormControl(listeningHistoryRawValue.songs ?? []),
    });
  }

  getListeningHistory(form: ListeningHistoryFormGroup): IListeningHistory | NewListeningHistory {
    return this.convertListeningHistoryRawValueToListeningHistory(
      form.getRawValue() as ListeningHistoryFormRawValue | NewListeningHistoryFormRawValue,
    );
  }

  resetForm(form: ListeningHistoryFormGroup, listeningHistory: ListeningHistoryFormGroupInput): void {
    const listeningHistoryRawValue = this.convertListeningHistoryToListeningHistoryRawValue({
      ...this.getFormDefaults(),
      ...listeningHistory,
    });
    form.reset(
      {
        ...listeningHistoryRawValue,
        id: { value: listeningHistoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ListeningHistoryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
      songs: [],
    };
  }

  private convertListeningHistoryRawValueToListeningHistory(
    rawListeningHistory: ListeningHistoryFormRawValue | NewListeningHistoryFormRawValue,
  ): IListeningHistory | NewListeningHistory {
    return {
      ...rawListeningHistory,
      timestamp: dayjs(rawListeningHistory.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertListeningHistoryToListeningHistoryRawValue(
    listeningHistory: IListeningHistory | (Partial<NewListeningHistory> & ListeningHistoryFormDefaults),
  ): ListeningHistoryFormRawValue | PartialWithRequiredKeyOf<NewListeningHistoryFormRawValue> {
    return {
      ...listeningHistory,
      timestamp: listeningHistory.timestamp ? listeningHistory.timestamp.format(DATE_TIME_FORMAT) : undefined,
      songs: listeningHistory.songs ?? [],
    };
  }
}
