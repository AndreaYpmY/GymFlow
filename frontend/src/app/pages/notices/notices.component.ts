import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';


import { NoticeService } from '../../services/notice.service';
import { Notice, UserRole } from '../../model/notice-types';
import { NoticeCardComponent } from '../../components/notice-card/notice-card.component';
import { NoticeFormComponent } from '../../components/notice-form/notice-form.component';

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [CommonModule, NoticeCardComponent, NoticeFormComponent, FormsModule],
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.css']
})
export class NoticesComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  
  // Proprietà per la gestione dello stato
  allNotices: Notice[] = [];
  filteredNotices: Notice[] = [];
  isLoading = true;
  
  // Proprietà per filtri e ordinamento
  currentFilter: 'all' | 'important' = 'all';
  sortBy: 'date-desc' | 'date-asc' | 'likes-desc' | 'title-asc' = 'date-desc';

  isProcessing: boolean = false; // Flag per prevenire richieste concorrenti

  // Simulazione ruolo utente - in produzione arriverà dal servizio di autenticazione
  userRole: UserRole = UserRole.CLIENT;
  
  readonly UserRole = UserRole;

  constructor(private noticeService: NoticeService) {}

  ngOnInit(): void {
    this.noticeService.getUserRole().subscribe(role => {
      this.userRole = UserRole[role as keyof typeof UserRole];
      this.applyFiltersAndSorting(); // Applica i filtri e l'ordinamento dopo aver ottenuto il ruolo
    });
    this.loadNotices();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadNotices(): void {
    this.isLoading = true;

    this.noticeService.getNotices().subscribe({
      next: (notices) => {
        //console.log('Notifiche caricate:', notices);
        this.allNotices = notices;
        this.applyFiltersAndSorting();
        this.isLoading = false;
      }
      ,
      error: (error) => {
        console.error('Errore nel caricamento delle notifiche:', error);
        this.isLoading = false;
      }
    }
    );
  
  }

  setFilter(filter: 'all' | 'important'): void {
    this.currentFilter = filter;
    this.applyFiltersAndSorting();
  }

  applySorting(): void {
    this.applyFiltersAndSorting();
  }

  private applyFiltersAndSorting(): void {
    let filtered = [...this.allNotices];

    // Applica filtro
    if (this.currentFilter === 'important') {
      filtered = filtered.filter(notice => notice.important);
    }

    // Applica ordinamento
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'likes-desc':
          return b.likes - a.likes;
        case 'title-asc':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    this.filteredNotices = filtered;
  }

  onNoticeCreated(noticeData: Omit<Notice, 'id' | 'createdAt' | 'likes' | 'likedByCurrentUser'>): void {
    this.noticeService.addNotice(noticeData).subscribe({
      next: () => {
        this.loadNotices(); // Ricarica le notifiche dopo l'aggiunta
      },
      error: (error) => {
        console.error('Errore nell\'aggiunta della notifica:', error);
      }
    });
  }

  onDeleteNotice(noticeId: string): void {
    this.noticeService.deleteNotice(noticeId).subscribe({
      next: () => {
        this.loadNotices(); // Ricarica le notifiche dopo la cancellazione
      },
      error: (error) => {
        console.error('Errore nella cancellazione della notifica:', error);
      }
    });
  }

  onLikeNotice(noticeId: string): void {
    if (this.isProcessing) return; // Ignora se una richiesta è in corso

    //prendo il notice dalla lista delle notifiche filtrate
    const notice = this.filteredNotices.find(n => n.id === noticeId);

    if (!notice) return;
    this.isProcessing = true; //Disabilito per evitare richieste concorrenti

    if (notice?.likedByCurrentUser) {
      // Se l'utente ha già messo like, rimuovo il like
      this.noticeService.unlikeNotice(noticeId).subscribe({
        next: () => {
          console.log('Like rimosso con successo');
          this.loadNotices(); 
          this.isProcessing = false; 

        },
        error: (error) => {
          console.error('Errore nello unlike della notifica:', error);
          this.isProcessing = false; 
        }
      });
    } else {
      // Altrimenti, metto il like
      this.noticeService.likeNotice(noticeId).subscribe({
        next: () => {
          console.log('Like aggiunto con successo');
          this.loadNotices(); 
          this.isProcessing = false; 
        },
        error: (error) => {
          console.error('Errore nel like della notifica:', error);
          this.isProcessing = false; 
        }
      });
    }

  }



  getImportantCount(): number {
    return this.allNotices.filter(notice => notice.important).length;
  }

  getTotalLikes(): number {
    return this.allNotices.reduce((total, notice) => total + notice.likes, 0);
  }
}