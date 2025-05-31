// announcements-carousel.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule


interface Announcement {
  id: number;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success';
  date: string;
  icon: string;
}

@Component({
  selector: 'app-announcements-carousel',
  templateUrl: './announcements-carousel.component.html',
  styleUrls: ['./announcements-carousel.component.css'],
  standalone: true
  , imports: [CommonModule] 
})
export class AnnouncementsCarouselComponent implements OnInit, OnDestroy {
  
  announcements: Announcement[] = [
    {
      id: 1,
      title: 'Chiusura Straordinaria',
      description: 'La palestra resterà chiusa il 30/05 per manutenzione straordinaria',
      type: 'warning',
      date: '25/05/2025',
      icon: '⚠️'
    },
    {
      id: 2,
      title: 'Nuovo Corso di Zumba!',
      description: 'Dal 1° giugno inizia il nuovo corso di Zumba ogni martedì e giovedì alle 19:00',
      type: 'success',
      date: '24/05/2025',
      icon: '💃'
    },
    {
      id: 3,
      title: 'Promozione Estiva',
      description: 'Sconto del 20% su tutti gli abbonamenti trimestrali. Affrettati!',
      type: 'info',
      date: '23/05/2025',
      icon: '🎉'
    }
  ];

  currentSlide = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoSlide(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.announcements.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 
      ? this.announcements.length - 1 
      : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  getTypeClass(type: string): string {
    return `announcement-${type}`;
  }
}