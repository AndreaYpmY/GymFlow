import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { ClientForAdmin, PaginatedClientsResponse } from '../../model/auth-types';


interface Subscription {
  id: number;
  clientName: string;
  clientSurname: string;
  email: string;
  endDate: Date;
  status: 'active' | 'expired' | 'expiring_soon';
}


@Component({
  standalone: true,
  selector: 'app-subscription-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './subscription-management.component.html',
  styleUrl: './subscription-management.component.css'
})
export class SubscriptionManagementComponent implements OnInit {
  subscriptions: Subscription[] = [];
  filteredSubscriptions: Subscription[] = [];
  statusFilter: string = '';
  searchTerm: string = '';
  showEditModal: boolean = false;
  selectedSubscription: Subscription | null = null;
  
  editForm = {
    endDate: ''
  };

  constructor(private adminService: AdminService) {}



  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    

    this.adminService.getClient().subscribe({
      next: (response: ClientForAdmin[]) => {
        this.subscriptions = response.map(client => ({
          id: client.id,
          clientName: client.name,
          clientSurname: client.surname,
          email: client.email,
          endDate: client.endOfSubscription ? new Date(client.endOfSubscription) : new Date(),
          status: 'active' // Imposta lo stato iniziale come 'active'
        }));

        this.filteredSubscriptions = [...this.subscriptions];
        this.updateSubscriptionStatus();
        this.applyFilters();
      },
      error: (error: any) => {
        console.error('Errore nel caricamento degli abbonamenti:', error);
      }
    });
  }

  updateSubscriptionStatus() {
    const today = new Date();
    
    this.subscriptions.forEach(sub => {
      const daysRemaining = this.getDaysRemaining(sub);
      
      if (daysRemaining < 0) {
        sub.status = 'expired';
      } else if (daysRemaining <= 7) {
        sub.status = 'expiring_soon';
      } else {
        sub.status = 'active';
      }
    });
  }

  applyFilters() {
    this.filteredSubscriptions = this.subscriptions.filter(sub => {
      const matchesStatus = !this.statusFilter || sub.status === this.statusFilter;
      const matchesSearch = !this.searchTerm || 
        (sub.clientName != null &&sub.clientName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (sub.clientSurname!=null &&  sub.clientSurname.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        sub.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        ;
      
      return matchesStatus && matchesSearch;
    });
  }

  getDaysRemaining(subscription: Subscription): number {
    const today = new Date();
    const endDate = new Date(subscription.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDaysRemainingClass(subscription: Subscription): string {
    const days = this.getDaysRemaining(subscription);
    if (days < 0) return 'days-critical'; 
    if (days <= 7) return 'days-warning'; // In scadenza
    return 'days-normal';
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'active': return 'Attivo';
      case 'expiring_soon': return 'In scadenza';
      case 'expired': return 'Scaduto';
      default: return status;
    }
  }

  editSubscription(subscription: Subscription) {
    this.selectedSubscription = subscription;
    this.editForm = {
      endDate: subscription.endDate.toISOString().split('T')[0],
    };
    this.showEditModal = true;
  }


  closeEditModal() {
    this.showEditModal = false;
    this.selectedSubscription = null;
  }

  saveSubscription() {
    if (this.selectedSubscription) {

      this.adminService.setNewSubscriptionEndDate(this.selectedSubscription.email, this.editForm.endDate).subscribe({
        next: () => {
          this.updateSubscriptionStatus();
          this.closeEditModal();
          this.loadSubscriptions();
          alert('Data di fine abbonamento aggiornata con successo!');
        },
        error: (error: any) => {
          console.error('Errore nell\'aggiornamento della data di fine abbonamento:', error);
          alert('Errore durante l\'aggiornamento della data di fine abbonamento');
        }
      });

    }
  }
}
