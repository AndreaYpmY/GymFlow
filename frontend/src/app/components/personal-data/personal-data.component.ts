import { Component, Input, OnChanges, Output, SimpleChanges,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserProfile } from '../../model/auth-types';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class PersonalDataComponent implements OnChanges {
  @Input() user: UserProfile | null = null;
  @Output() userUpdated = new EventEmitter<UserProfile>();

  
  personalDataForm: FormGroup;
  isEditing = false;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;



  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {

    this.personalDataForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      fiscalCode: ['', Validators.required],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      role: ['', Validators.required],
      password: [''] // Password non è obbligatoria per l'aggiornamento, ma può essere usata per la modifica
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.loadUserData();
    }

  }
  loadUserData(): void {
    if (this.user) {
      this.personalDataForm.patchValue({
        email: this.user.email,
        password: '',
        fiscalCode: this.user.fiscalCode,
        name: this.user.name,
        surname: this.user.surname,
        dateOfBirth: this.formatDate(this.user.dateOfBirth),
        role: this.user.role
      });
    }
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      return '';
    }
    return d.toISOString().split('T')[0]; // yyyy-mm-dd
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadUserData(); // Reset form se annulla
      this.successMessage = null;
      this.errorMessage = null;
    }
  }



  onSubmit(): void {
    if (this.personalDataForm.valid && this.user) {
      this.isLoading = true;
      const formData = this.personalDataForm.getRawValue();
    
      
      const updatedUser: UserProfile = { // Merge dei dati dell'utente con i dati del form
        ...this.user,
        email: formData.email,
        fiscalCode: formData.fiscalCode,
        name: formData.name,
        surname: formData.surname,
        dateOfBirth: formData.dateOfBirth,
        role: this.user.role, // Mantiengo il ruolo originale
        ...(formData.password && { password: formData.password }) // Includo password solo se non vuota
      };

      this.userService.updateUser(updatedUser).subscribe({
        next: (response) => {
          this.user = response; // Aggiorna l'utente corrente con la risposta del server
          this.authService.updateUser(response); // Aggiorna lo stato globale
          this.isEditing = false;
          this.isLoading = false;
          this.successMessage = 'Profilo aggiornato con successo!';
          this.loadUserData(); // Ricarica i dati nel form
          this.userUpdated.emit(response); // Emissione dell'evento con l'utente aggiornato
        },
        error: (error) => {
          console.error('Errore aggiornamento:', error);
          this.isLoading = false;
          this.errorMessage = error.message || 'Errore durante l\'aggiornamento del profilo.';
        }
      });

    }
  }
}
