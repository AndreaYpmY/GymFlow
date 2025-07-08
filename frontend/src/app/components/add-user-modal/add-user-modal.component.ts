import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserFormData} from "../../model/auth-types"


interface RoleOption {
  value: string;
  label: string;
}

// Custom validator per codice fiscale italiano
function fiscalCodeValidator(control: AbstractControl): {[key: string]: any} | null {
  const value = control.value;
  if (!value) return null;
  
  const fiscalCodeRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i;
  return fiscalCodeRegex.test(value) ? null : { invalidFiscalCode: true };
}

// Custom validator per data futura
function futureDateValidator(control: AbstractControl): {[key: string]: any} | null {
  const value = control.value;
  if (!value) return null;
  
  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return selectedDate > today ? null : { pastDate: true };
}

// Custom validator per ore lavorative (0-24, con step di 0.5)
function hoursValidator(control: AbstractControl): { [key: string]: any } | null {
  const value = control.value;
  if (value === null || value === '') return null;

  const numValue = Number(value);
  if (isNaN(numValue)) return { invalidNumber: true };
  if (numValue < 0 || numValue > 24) return { outOfRange: true };
  if (numValue % 0.5 !== 0) return { invalidStep: true }; // Solo multipli di 0.5

  return null;
}

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class AddUserModalComponent implements OnInit, OnChanges {
  @Input() showModal = false;
  @Input() roleOptions: RoleOption[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() createUser = new EventEmitter<UserFormData>();

  addUserForm!: FormGroup;
  addingUser = false;

  readonly dayLabels: Record<string, string> = {
    monday: 'Lunedì',
    tuesday: 'Martedì',
    wednesday: 'Mercoledì',
    thursday: 'Giovedì',
    friday: 'Venerdì',
    saturday: 'Sabato'
  };

  readonly daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  constructor(private fb: FormBuilder) {    this.initializeForm();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showModal'] && !changes['showModal'].currentValue && changes['showModal'].previousValue) {
      this.resetForm();
    }
  }

  private initializeForm(): void {
    this.addUserForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ]],
      fiscalCode: ['', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16),
        fiscalCodeValidator
      ]],
      role: ['', Validators.required],
      subscriptionEndDate: [''],
      weeklyHours: this.fb.group({
        monday: [0, [hoursValidator]],
        tuesday: [0, [hoursValidator]],
        wednesday: [0, [hoursValidator]],
        thursday: [0, [hoursValidator]],
        friday: [0, [hoursValidator]],
        saturday: [0, [hoursValidator]]
      })
    });

    this.addUserForm.get('role')?.valueChanges.subscribe(role => {
      this.updateValidatorsForRole(role);
    });
  }

  private updateValidatorsForRole(role: string): void {
    const subscriptionEndDateControl = this.addUserForm.get('subscriptionEndDate');

    if (role === 'CLIENT') {
      subscriptionEndDateControl?.setValidators([Validators.required, futureDateValidator]);
    } else {
      subscriptionEndDateControl?.clearValidators();
    }

    subscriptionEndDateControl?.updateValueAndValidity();
  }

  get isClient(): boolean {
    return this.addUserForm.get('role')?.value === 'CLIENT';
  }

  get isTrainer(): boolean {
    return this.addUserForm.get('role')?.value === 'TRAINER';
  }

  get totalWeeklyHours(): number {
    if (!this.isTrainer) return 0;

    const weeklyHours = this.addUserForm.get('weeklyHours')?.value;
    return this.daysOrder.reduce((total: number, day: string) => total + (Number(weeklyHours[day]) || 0), 0);
  }

  onSubmit(): void {
    if (this.addUserForm.valid && !this.addingUser) {
      this.addingUser = true;
      const formData = this.prepareFormData();
      this.createUser.emit(formData);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.addUserForm.controls).forEach(key => {
      const control = this.addUserForm.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      }
    });
  }

  private prepareFormData(): UserFormData {
    const formValue = this.addUserForm.value;

    const baseData: UserFormData = {
      email: formValue.email.trim().toLowerCase(),
      fiscalCode: formValue.fiscalCode.trim().toUpperCase(),
      role: formValue.role
    };

    if (formValue.role === 'CLIENT') {
      baseData.subscriptionEndDate = formValue.subscriptionEndDate || null;
    } else if (formValue.role === 'TRAINER') {
      baseData.weeklyHours = formValue.weeklyHours;
    }

    return baseData;
  }


  onUserCreationError(): void {
    this.addingUser = false;
  }

  close(): void {
    if (this.addingUser) return;

    this.resetForm();
    this.closeModal.emit();
  }

  private resetForm(): void {
    this.addUserForm.reset({
      email: '',
      fiscalCode: '',
      role: '',
      subscriptionEndDate: '',
      weeklyHours: {
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0
      }
    });
    this.addingUser = false;
  }

  onFiscalCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  onHoursInput(event: Event, day: string): void {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);

    if (isNaN(value) || value < 0) {
      value = 0;
    } else if (value > 24) {
      value = 24;
    } else {
      // Arrotonda al multiplo di 0.5 più vicino
      value = Math.round(value * 2) / 2;
    }

    this.addUserForm.get(`weeklyHours.${day}`)?.setValue(value, { emitEvent: false });
    input.value = value.toString();
  }


  getFieldError(fieldName: string): string | null {
    const control = fieldName.includes('weeklyHours') ? this.addUserForm.get(fieldName) : this.addUserForm.get(fieldName);
    if (!control?.errors || !control.touched) return null;

    if (control.errors['required']) return `Il campo ${this.getFieldLabel(fieldName)} è obbligatorio`;
    if (control.errors['email']) return 'Inserisci un indirizzo email valido';
    if (control.errors['minlength'] || control.errors['maxlength']) {
      return fieldName === 'fiscalCode' ? 'Il codice fiscale deve essere di 16 caratteri' : 'Lunghezza non valida';
    }
    if (control.errors['invalidFiscalCode']) return 'Il formato del codice fiscale non è valido';
    if (control.errors['pastDate']) return 'Seleziona una data futura';
    if (control.errors['outOfRange']) return 'Il valore deve essere tra 0 e 24 ore';
    if (control.errors['invalidStep']) return 'Il valore deve essere un multiplo di 0.5 (es. 1, 1.5, 2)';
    if (control.errors['invalidNumber']) return 'Inserisci un numero valido';

    return 'Campo non valido';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      'email': 'email',
      'fiscalCode': 'codice fiscale',
      'role': 'ruolo',
      'subscriptionEndDate': 'scadenza abbonamento',
      'weeklyHours.monday': 'ore di lunedì',
      'weeklyHours.tuesday': 'ore di martedì',
      'weeklyHours.wednesday': 'ore di mercoledì',
      'weeklyHours.thursday': 'ore di giovedì',
      'weeklyHours.friday': 'ore di venerdì',
      'weeklyHours.saturday': 'ore di sabato'
    };
    return labels[fieldName] || fieldName;
  }

  getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
}