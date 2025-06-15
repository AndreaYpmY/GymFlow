import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { UserForAdmin, PaginatedResponse, UserFormData } from '../../services/types';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.service';
import { AddUserModalComponent } from '../../components/add-user-modal/add-user-modal.component';



interface UserFilters {
  search: string;
  role: string;
  isActive: string;
  isVerified: string;
}


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,AddUserModalComponent],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>(); // Per gestire la cancellazione degli observable

  roleOptions = [
    { value: 'TRAINER', label: 'Trainer' },
    { value: 'CLIENT', label: 'Client' }
  ];

  // Data
  users: UserForAdmin[] = [];
  totalUsers = 0;
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  loading = false;

  // Filtri e ricerca
  searchTerm = '';
  private searchSubject = new Subject<string>(); 
  
  filters: UserFilters = {
    search: '',
    role: '',
    isActive: '',
    isVerified: ''
  };

  // Forms
  showAddUserModal = false;
  showRegistrationCodePopup = false; 
  newUserRegistrationCode = '';

  // Filtri
  roles = [
    { value: '', label: 'Tutti i ruoli' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'TRAINER', label: 'Trainer' },
    { value: 'CLIENT', label: 'Client' }
  ];

  activeOptions = [
    { value: '', label: 'Tutti' },
    { value: 'true', label: 'Attivi' },
    { value: 'false', label: 'Disattivati' }
  ];

  verifiedOptions = [
    { value: '', label: 'Tutti' },
    { value: 'true', label: 'Verificati' },
    { value: 'false', label: 'Non verificati' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService, 
    private adminService: AdminService
    // private notificationService: NotificationService // For showing success/error messages
  ) {
  }

  ngOnInit() {
    this.setupSearchDebounce();
    this.loadUsers();
  }

  ngOnDestroy() { // Per evitare memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce() { 
    this.searchSubject
      .pipe(
        debounceTime(300),      // Attendo 300ms prima di emettere il valore
        distinctUntilChanged(), // Per evitare chiamate multiple con lo stesso valore
        takeUntil(this.destroy$) // Completa l'observable quando il componente viene distrutto
      )
      .subscribe(searchTerm => {
        this.filters.search = searchTerm;
        this.currentPage = 1;
        this.loadUsers();
      });
  }

  onSearchChange(value: string) {
    this.searchSubject.next(value);
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadUsers();
  }

  private loadUsers() {
    this.loading = true;
    
    const params = {
      page: this.currentPage - 1, // Convert to 0-based index
      limit: this.pageSize,
      search: this.filters.search,
      role: this.filters.role,
      isActive: this.filters.isActive,
      isVerified: this.filters.isVerified
    };

    // Rimuovo le chiavi con valori vuoti
    Object.keys(params).forEach(key => {
      if (params[key as keyof typeof params] === '') {
        delete params[key as keyof typeof params];
      }
    });

    this.adminService.getUsers(params).subscribe({ 
       next: (response: PaginatedResponse) => {
         this.users = response.content;
         this.totalUsers = response.totalElements;
         this.totalPages = response.totalPages;
         this.currentPage = response.number + 1; // Convert to 1-based index
         this.pageSize = response.size;
         this.loading = false;
       },
     error: (error) => {
         console.error('Error loading users:', error);
         this.loading = false;
       }
     });

    // Mock data for demonstration
    //setTimeout(() => {
    //  this.mockLoadUsers();
    //}, 500);
  }

  private mockLoadUsers() {
    // Mock implementation - replace with actual service call
    const mockUsers: UserForAdmin[] = [
      {
        id: 1,
        email: 'admin@example.com',
        fiscalCode: 'RSSMRA80A01F205X',
        name: 'Mario',
        surname: 'Rossi',
        dateOfBirth: '1980-01-01',
        registrationCode: 'REG001',
        active: true,
        verified: true,
        role: 'ADMIN',
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        email: 'trainer@example.com',
        fiscalCode: 'BNCGVN85M15F205Y',
        name: 'Giovanni',
        surname: 'Bianchi',
        dateOfBirth: '1985-08-15',
        registrationCode: 'REG002',
        active: true,
        verified: false,
        role: 'TRAINER',
        createdAt: '2024-02-20'
      }
    ];

    this.users = mockUsers;
    this.totalUsers = 25; // Mock total
    this.totalPages = Math.ceil(this.totalUsers / this.pageSize);
    this.loading = false;
  }

  toggleUserStatus(user: UserForAdmin) {
    if (confirm(`Sei sicuro di voler ${user.active ? 'disattivare' : 'attivare'} l'utente ${user.name} ${user.surname}?`)) {
      this.loading = true;
      
      // Replace with actual service call
      // this.userService.toggleUserStatus(user.id, !user.isActive).subscribe({
      //   next: () => {
      //     user.isActive = !user.isActive;
      //     this.notificationService.success(`Utente ${user.isActive ? 'attivato' : 'disattivato'} con successo`);
      //     this.loading = false;
      //   },
      //   error: (error) => {
      //     console.error('Error toggling user status:', error);
      //     this.notificationService.error('Errore durante l\'aggiornamento dello stato utente');
      //     this.loading = false;
      //   }
      // });

      // Mock implementation
      setTimeout(() => {
        user.active = !user.active;
        this.loading = false;
        alert(`Utente ${user.active ? 'attivato' : 'disattivato'} con successo`);
      }, 500);
    }
  }

  openAddUserModal() {
    this.showAddUserModal = true;
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
  }


  onCreateUser(formData: UserFormData) {
    this.adminService.createUser(formData).subscribe({
      next: (response) => {
        this.closeAddUserModal();
        this.loadUsers();
        this.newUserRegistrationCode = response.registrationCode;
        //console.log(this.newUserRegistrationCode)
        this.showRegistrationCodePopup = true; 
        //alert('Utente creato con successo!');
      },
      error: (error) => {
        console.error('Errore creazione utente:', error);
        alert('Errore durante la creazione dell\'utente');
        this.closeAddUserModal()
      }
    });
  }

  closeRegistrationCodePopup() {
    this.showRegistrationCodePopup = false;
    this.newUserRegistrationCode = '';
  }

  copyRegistrationCode() {
    if (this.newUserRegistrationCode) {
      navigator.clipboard.writeText(this.newUserRegistrationCode).then(() => {
        alert('Codice copiato negli appunti!');
      }).catch(err => {
        console.error('Errore nella copia:', err);
        alert('Errore durante la copia del codice');
      });
    }
  }

  private generateRegistrationCode(): string {
    return 'REG' + Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  clearFilters() {
    this.filters = {
      search: '',
      role: '',
      isActive: '',
      isVerified: ''
    };
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  getRoleClass(role: string|null): string {
    if (!role) {
      return 'role-unknown';
    }
    return `role-${role.toLowerCase()}`;
  }

  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  getVerificationClass(isVerified: boolean): string {
    return isVerified ? 'verified' : 'not-verified';
  }
}