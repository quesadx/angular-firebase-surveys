import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { SurveyService } from './survey.service';

const minOptionsValidator = (min: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const array = control as FormArray;
    if (!array || typeof array.length !== 'number') {
      return { minOptions: { required: min, actual: 0 } };
    }

    // Count non-empty options (after trimming whitespace)
    const nonEmptyCount = array.controls
      .filter((ctrl) => (ctrl.value ?? '').trim().length > 0)
      .length;

    return nonEmptyCount >= min ? null : { minOptions: { required: min, actual: nonEmptyCount } };
  };
};

/**
 * Validator to ensure option is not empty or just whitespace
 */
const optionNotEmptyValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return { required: true };
  }

  const trimmed = (control.value as string).trim();
  return trimmed.length > 0 ? null : { required: true };
};

@Component({
  selector: 'app-new-survey',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <div class="card">
        <header class="card-header">
          <p class="eyebrow">Form</p>
          <h1>New Survey</h1>
          <p class="subtitle">Create a survey with at least 2 options.</p>
        </header>

        <form class="survey-form" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="field">
            <label for="title">Title</label>
            <input
              id="title"
              type="text"
              formControlName="title"
              maxlength="120"
              placeholder="E.g.: Favorite flavor"
            />
            <div class="field-meta">
              <span class="hint">Required</span>
              <span class="counter">{{ titleLength() }}/120</span>
            </div>
            @if (isTitleInvalid()) {
              <p class="error">Title is required.</p>
            }
          </div>

          <div class="field">
            <label for="description">Description (optional)</label>
            <textarea
              id="description"
              rows="4"
              formControlName="description"
              placeholder="Share more context"
            ></textarea>
          </div>

          <div class="field">
            <div class="field-heading">
              <div>
                <label>Options</label>
                <p class="hint">Minimum {{ minOptions }} options. Current: {{ optionsCount() }}.</p>
              </div>
            </div>

            <div class="options">
              @for (optionCtrl of options.controls; track $index) {
                <div class="option-row">
                  <input
                    type="text"
                    [formControl]="optionCtrl"
                    placeholder="Option {{ $index + 1 }}"
                  />
                  <button
                    class="remove"
                    type="button"
                    (click)="removeOption($index)"
                    [disabled]="options.length <= minOptions"
                    title="Remove option"
                  >
                    ✕
                  </button>
                </div>
                @if (showOptionError(optionCtrl)) {
                  <p class="error">Option is required.</p>
                }
              }
            </div>

            <div class="add-option-row">
              <button class="ghost" type="button" (click)="addOption()">Add option</button>
            </div>

            @if (isOptionsInvalid()) {
              <p class="error">Add at least {{ minOptions }} options.</p>
            }
          </div>

          <div class="actions">
            <button class="primary" type="submit" [disabled]="isSaving()">
              {{ isSaving() ? 'Saving...' : 'Save' }}
            </button>
          </div>

          @if (saveState() === 'saved') {
            <div class="notice success">Survey ready to save (no backend).</div>
          }

          @if (errorMessage()) {
            <div class="notice error">{{ errorMessage() }}</div>
          }
        </form>
      </div>
    </section>
  `,
  styleUrl: './new-survey.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewSurveyComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly surveyService = inject(SurveyService);

  protected readonly minOptions = 2;
  protected readonly optionsCount = signal(this.minOptions);
  protected readonly saveState = signal<'idle' | 'invalid' | 'saved'>('idle');
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected readonly form = this.fb.group({
    title: this.fb.control('', [Validators.required, Validators.maxLength(120)]),
    description: this.fb.control(''),
    options: this.fb.array<FormControl<string>>([], {
      validators: [minOptionsValidator(this.minOptions)]
    })
  });

  constructor() {
    for (let i = 0; i < this.minOptions; i += 1) {
      this.addOption();
    }
  }

  get options(): FormArray<FormControl<string>> {
    return this.form.controls.options;
  }

  protected titleLength(): number {
    return this.form.controls.title.value.length;
  }

  protected addOption(): void {
    this.options.push(
      this.fb.control('', [optionNotEmptyValidator, Validators.maxLength(80)])
    );
    this.optionsCount.set(this.options.length);
  }

  protected removeOption(index: number): void {
    if (this.options.length <= this.minOptions) {
      return;
    }

    this.options.removeAt(index);
    this.optionsCount.set(this.options.length);
  }

  protected showOptionError(control: AbstractControl): boolean {
    return (control.touched || this.saveState() === 'invalid') && control.invalid;
  }

  protected isOptionsInvalid(): boolean {
    return this.saveState() === 'invalid' && Boolean(this.options.errors?.['minOptions']);
  }

  protected isTitleInvalid(): boolean {
    const control = this.form.controls.title;
    return (control.touched || this.saveState() === 'invalid') && control.invalid;
  }

  protected async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.saveState.set('invalid');
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      title: this.form.controls.title.value.trim(),
      description: this.form.controls.description.value.trim(),
      options: this.options.controls.map((control) => control.value.trim()).filter(Boolean)
    };

    // Validate options count after trim
    if (payload.options.length < this.minOptions) {
      this.errorMessage.set(`At least ${this.minOptions} options are required.`);
      this.saveState.set('invalid');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      const docRef = await this.surveyService.addSurvey(payload);
      
      if (!docRef?.id) {
        throw new Error('Failed to save survey: No document ID returned');
      }

      this.saveState.set('saved');
      await this.router.navigate(['/surveys', docRef.id]);
    } catch (error) {
      console.error('Error saving survey:', error);
      this.saveState.set('invalid');
      
      // Set user-friendly error message
      if (error instanceof Error) {
        this.errorMessage.set(error.message);
      } else {
        this.errorMessage.set('An error occurred while saving the survey. Please try again.');
      }
    } finally {
      this.isSaving.set(false);
    }
  }
}
