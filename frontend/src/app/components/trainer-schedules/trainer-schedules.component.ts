import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { TrainerForAdmin } from '../../model/auth-types';

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
interface TimeSlot {
  hours: number;
  isActive: boolean;
}

interface TrainerSchedule {
  id: number;
  trainerId: number;
  trainerName: string;
  trainerSurname: string;
  email: string;
  schedules: {
    [key in DayKey]: TimeSlot;
  };
}



@Component({
  standalone: true,
  selector: 'app-trainer-schedules',
  imports: [CommonModule, FormsModule],
  templateUrl: './trainer-schedules.component.html',
  styleUrl: './trainer-schedules.component.css'
})
export class TrainerSchedulesComponent implements OnInit{
  trainers: TrainerSchedule[] = [];
  filteredTrainers: TrainerSchedule[] = [];
  searchTerm: string = '';
  showEditModal: boolean = false;
  selectedTrainer: TrainerSchedule | null = null;

  editForm: { [key in DayKey]: TimeSlot } = {
    monday: { hours: 0, isActive: false },
    tuesday: { hours: 0, isActive: false },
    wednesday: { hours: 0, isActive: false },
    thursday: { hours: 0, isActive: false },
    friday: { hours: 0, isActive: false },
    saturday: { hours: 0, isActive: false }
  };
  
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadTrainers();
  }

  loadTrainers() {
    //console.log('Caricamento dei trainer...');

    this.adminService.getTrainer().subscribe({
      next: (trainers: TrainerForAdmin[]) => {
          this.trainers = trainers.map(trainer => ({
            id: trainer.id,
            trainerId: trainer.id,
            trainerName: trainer.name,
            trainerSurname: trainer.surname,
            email: trainer.email,
            schedules: this.convertToTimeSlots(trainer.schedules)
          }));
          this.filteredTrainers = [...this.trainers];

          this.applyFilter();

      },
      error: error => {
        console.error('Errore nel caricamento dei trainer:', error);
      }
    });
    
  }

  convertToTimeSlots(raw: { [key in DayKey]: number }): { [key in DayKey]: TimeSlot } {
    const result: Partial<{ [key in DayKey]: TimeSlot }> = {};
  
    (Object.keys(raw) as DayKey[]).forEach(day => {
      result[day] = {
        hours: raw[day],
        isActive: raw[day] > 0
      };
    });
  
    return result as { [key in DayKey]: TimeSlot };
  }

  applyFilter() {
    this.filteredTrainers = this.trainers.filter(trainer => {
      const searchLower = this.searchTerm.toLowerCase();
      return (trainer.trainerName!= null && trainer.trainerName.toLowerCase().includes(searchLower)) ||
             (trainer.trainerSurname!= null && trainer.trainerSurname.toLowerCase().includes(searchLower)) ||
             trainer.email.toLowerCase().includes(searchLower);
    });
  }

  getDaysOfWeek(): { key: DayKey; label: string }[] {
    return [
      { key: 'monday', label: 'Lunedì' },
      { key: 'tuesday', label: 'Martedì' },
      { key: 'wednesday', label: 'Mercoledì' },
      { key: 'thursday', label: 'Giovedì' },
      { key: 'friday', label: 'Venerdì' },
      { key: 'saturday', label: 'Sabato' }
    ];
  }

  editTrainerSchedule(trainer: TrainerSchedule) {
    this.selectedTrainer = trainer;
  
    // Copia gli orari per la modifica
    this.getDaysOfWeek().forEach(day => {
      this.editForm[day.key] = {
        hours: trainer.schedules[day.key].hours,
        isActive: trainer.schedules[day.key].isActive
      };
    });
  
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedTrainer = null;
    this.editForm = {
      monday: { hours: 0, isActive: false },
      tuesday: { hours: 0, isActive: false },
      wednesday: { hours: 0, isActive: false },
      thursday: { hours: 0, isActive: false },
      friday: { hours: 0, isActive: false },
      saturday: { hours: 0, isActive: false }
    };
  }

  saveSchedule() {
    if (this.selectedTrainer) {
      // Validazione orari
      const errors = this.validateSchedule();
      if (errors.length > 0) {
        alert('Errori negli orari:\n' + errors.join('\n'));
        return;
      }

      
      // Aggiorna gli orari del trainer
      const trainerToSave = this.mapToTrainerForAdmin();

      this.adminService.updateTrainerSchedule(trainerToSave).subscribe({
        next: () => {

          this.getDaysOfWeek().forEach(day => {
            this.selectedTrainer!.schedules[day.key] = {
              hours: this.editForm[day.key]!.hours,
              isActive: this.editForm[day.key]!.isActive
            };
          });
          this.closeEditModal();
          this.loadTrainers(); // Ricarica i trainer per mostrare le modifiche
          alert('Orari del trainer aggiornati con successo!');
        }
        ,
        error: (error:any) => {
          console.error('Errore nell\'aggiornamento degli orari del trainer:', error);
          alert('Errore durante l\'aggiornamento degli orari del trainer');
        }
      });
    }
  }
  updateDayIsActive(dayKey: DayKey, value: boolean) {
    this.editForm[dayKey] = {
      ...this.editForm[dayKey],
      isActive: value
    };
  }
  
  updateDayHours(dayKey: DayKey, value: number) {
    this.editForm[dayKey] = {
      ...this.editForm[dayKey],
      hours: value
    };
  }
  

  validateSchedule(): string[] {
    const errors: string[] = [];

    this.getDaysOfWeek().forEach(day => {
      const schedule = this.editForm[day.key];
      if (schedule?.isActive) {
        if (schedule.hours <= 0) {
          errors.push(`${day.label}: Le ore devono essere maggiori di 0`);
        } else if (schedule.hours > 12) {
          errors.push(`${day.label}: Le ore non possono superare le 12 ore giornaliere`);
        }
      }
    });

    return errors;
  }

  formatHours(hours: number): string {
    if (hours == null || hours === 0) return 'Nessuna ora';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
  
    let result = '';
    if (wholeHours > 0) {
      result += wholeHours + (wholeHours === 1 ? ' ora' : ' ore');
    }
    if (minutes > 0) {
      if (result.length > 0) result += ' ';
      result += minutes + ' minuti';
    }
    return result;
  }

  private mapToTrainerForAdmin(): TrainerForAdmin {
    return {
      id: this.selectedTrainer!.trainerId,
      name: this.selectedTrainer!.trainerName,
      surname: this.selectedTrainer!.trainerSurname,
      email: this.selectedTrainer!.email,
      schedules: Object.fromEntries(
        this.getDaysOfWeek().map(day => [
          day.key,
          this.editForm[day.key].hours
        ])
      ) as { [key in DayKey]: number }
    };
  }
  
}