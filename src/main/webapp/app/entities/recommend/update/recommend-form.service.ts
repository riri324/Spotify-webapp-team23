import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IRecommend, NewRecommend } from '../recommend.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRecommend for edit and NewRecommendFormGroupInput for create.
 */
type RecommendFormGroupInput = IRecommend | PartialWithRequiredKeyOf<NewRecommend>;

type RecommendFormDefaults = Pick<NewRecommend, 'id'>;

type RecommendFormGroupContent = {
  id: FormControl<IRecommend['id'] | NewRecommend['id']>;
  userId: FormControl<IRecommend['userId']>;
  recommendedUserId: FormControl<IRecommend['recommendedUserId']>;
  commonSongsCount: FormControl<IRecommend['commonSongsCount']>;
};

export type RecommendFormGroup = FormGroup<RecommendFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RecommendFormService {
  createRecommendFormGroup(recommend: RecommendFormGroupInput = { id: null }): RecommendFormGroup {
    const recommendRawValue = {
      ...this.getFormDefaults(),
      ...recommend,
    };
    return new FormGroup<RecommendFormGroupContent>({
      id: new FormControl(
        { value: recommendRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      userId: new FormControl(recommendRawValue.userId, {
        validators: [Validators.required],
      }),
      recommendedUserId: new FormControl(recommendRawValue.recommendedUserId, {
        validators: [Validators.required],
      }),
      commonSongsCount: new FormControl(recommendRawValue.commonSongsCount, {
        validators: [Validators.required, Validators.min(5)],
      }),
    });
  }

  getRecommend(form: RecommendFormGroup): IRecommend | NewRecommend {
    return form.getRawValue() as IRecommend | NewRecommend;
  }

  resetForm(form: RecommendFormGroup, recommend: RecommendFormGroupInput): void {
    const recommendRawValue = { ...this.getFormDefaults(), ...recommend };
    form.reset(
      {
        ...recommendRawValue,
        id: { value: recommendRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RecommendFormDefaults {
    return {
      id: null,
    };
  }
}
