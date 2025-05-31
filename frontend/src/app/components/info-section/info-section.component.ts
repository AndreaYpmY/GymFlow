import { Component, OnInit } from '@angular/core';

interface InfoItem {
  title: string;
  icon: string;
}

interface ScheduleDay {
  day: string;
  hours: string;
  isToday?: boolean;
}

@Component({
  selector: 'app-info-section',
  templateUrl: './info-section.component.html',
  styleUrls: ['./info-section.component.css'],
  standalone: true
})
export class InfoSectionComponent implements OnInit {

  schedule: ScheduleDay[] = [
    { day: 'Lunedì - Venerdì', hours: '06:00 - 22:00' },
    { day: 'Sabato', hours: '08:00 - 20:00' },
    { day: 'Domenica', hours: 'CHIUSO' }
  ];

  infoItems: InfoItem[] = [
    {
      title: 'Parcheggio Gratuito',
      icon: '🚗'
    },
    {
      title: 'WiFi Gratuito',
      icon: '📶'
    },
    {
      title: 'Spogliatoi & Docce',
      icon: '🚿'
    },
    {
      title: 'Aria Condizionata',
      icon: '❄️'
    },
    {
      title: 'Musica Ambiente',
      icon: '🎵'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.setTodaySchedule();
  }

  private setTodaySchedule(): void {
    const today = new Date().getDay(); // 0 = Domenica, 1 = Lunedì, etc.
    // Reset isToday flag
    
    this.schedule.forEach(item => {
      if (today >= 1 && today <= 5 && item.day === 'Lunedì - Venerdì') {
        item.isToday = true;
      } else if (today === 6 && item.day === 'Sabato') {
        item.isToday = true;
      } else if (today === 0 && item.day === 'Domenica') {
        item.isToday = true;
      }
    });
  }

  isOpen(): boolean {
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    
    // Domenica = chiuso
    if (currentDay === 0) return false;
    
    // Sabato: 8-20
    if (currentDay === 6) {
      return currentHour >= 8 && currentHour < 20;
    }
    
    // Lunedì-Venerdì: 6-22
    return currentHour >= 6 && currentHour < 22;
  }
}