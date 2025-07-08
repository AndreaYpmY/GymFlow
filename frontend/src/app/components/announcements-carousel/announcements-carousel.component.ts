import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeService } from '../../services/notice.service';
import { Notice } from '../../model/notice-types';

interface Announcement {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

@Component({
  selector: 'app-announcements-carousel',
  templateUrl: './announcements-carousel.component.html',
  styleUrls: ['./announcements-carousel.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AnnouncementsCarouselComponent implements OnInit, OnDestroy {
  
  @Input() announcements: Announcement[] = [];

  constructor(private noticeService: NoticeService) {}
  

  //Funzione per ricevere gli avvisi
  loadAnnouncements(): void {
    
    this.noticeService.getTopNotices().subscribe({
      next: (data: Notice[]) => {
        // Mappa i dati ricevuti al formato degli annunci
        this.announcements = data.map((notice: Notice) => (notice as any) as Announcement).map(notice => ({
          id: notice.id,
          title: notice.title,
          description: notice.description,
          createdAt: new Date(notice.createdAt).toLocaleDateString('it-IT')
        }));
        // Se ci sono avvisi, ferma l'auto-slide
        if (this.announcements.length > 1) {
          this.startAutoSlide();
        } else {
          this.stopAutoSlide();
        } 
      }
      ,
      error: (error: any) => {
        console.error('Errore nel caricamento degli avvisi:', error);
      }
    });
  }

  currentSlide = 0;
  private intervalId: any;
  private readonly AUTO_SLIDE_INTERVAL = 6000; // 6 secondi

  ngOnInit(): void {
    // Se non ci sono announcements in input, usa i dati mock
    if (this.announcements.length === 0) {
      this.loadAnnouncements();
    }
    
    // Avvia l'auto-slide solo se ci sono almeno 2 avvisi
    if (this.announcements.length > 1) {
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  private startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.AUTO_SLIDE_INTERVAL);
  }

  private stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextSlide(): void {
    if (this.announcements.length === 0) return;
    
    this.currentSlide = (this.currentSlide + 1) % this.announcements.length;
    this.resetAutoSlide();
  }

  prevSlide(): void {
    if (this.announcements.length === 0) return;
    
    this.currentSlide = this.currentSlide === 0 
      ? this.announcements.length - 1 
      : this.currentSlide - 1;
    this.resetAutoSlide();
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.announcements.length) {
      this.currentSlide = index;
      this.resetAutoSlide();
    }
  }

  private resetAutoSlide(): void {
    if (this.announcements.length > 1) {
      this.stopAutoSlide();
      this.startAutoSlide();
    }
  }

  //Extra

  // Genero un colore basato sull'indice dell'avviso per varietà visiva
  getAnnouncementClass(index: number): string {
    const classes = ['announcement-primary', 'announcement-secondary', 'announcement-accent'];
    return classes[index % classes.length];
  }

  // Genero un'icona basata su parole chiave nel titolo
  getAnnouncementIcon(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('chiusura') || lowerTitle.includes('chiuso') || lowerTitle.includes('manutenzione')) {
      return '🔧';
    }
    if (lowerTitle.includes('corso') || lowerTitle.includes('lezione') || lowerTitle.includes('training')) {
      return '💪';
    }
    if (lowerTitle.includes('evento') || lowerTitle.includes('competizione') || lowerTitle.includes('gara')) {
      return '🏆';
    }
    if (lowerTitle.includes('orario') || lowerTitle.includes('apertura') || lowerTitle.includes('orari')) {
      return '⏰';
    }
    
    return '📢';
  }

  // Controlla se il componente deve essere mostrato
  get shouldShowCarousel(): boolean {
    return this.announcements && this.announcements.length > 0;
  }

  // Controlla se mostrare i controlli di navigazione
  get shouldShowNavigation(): boolean {
    return this.announcements.length > 1;
  }
}