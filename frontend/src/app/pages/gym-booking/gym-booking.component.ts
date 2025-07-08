import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, catchError, of, finalize } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { User, GymSchedule, Booking } from '../../model/booking-types';


@Component({
  standalone: true,
  imports: [CommonModule], 
  selector: 'app-gym-booking',
  templateUrl: './gym-booking.component.html',
  styleUrls: ['./gym-booking.component.css']
})
export class GymBookingComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly MAX_BOOKING_DAYS_AHEAD = 14; // Presa dal service

  loading = false;
  currentUser: User | null = null;
  schedules: GymSchedule[] = [];
  selectedDate: string = '';
  selectedSchedule: GymSchedule | null = null;
  showAdminPanel = false;


  
  // Calendario
  currentMonth = new Date();
  calendarDays: { date: string; isCurrentMonth: boolean; hasBookings: boolean; dayNumber: number }[] = [];
  
  
  // Admin gestione slot
  adminSelectedSlots: string[] = [];
  adminSlotAction: 'disable' | 'enable' = 'disable';
  
  constructor(private bookingService: BookingService) {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.bookingService.initializeSchedule();
  }

  ngOnInit(): void {
    this.loading = true;
    this.getCurrentUser();
    this.getSchedule();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // === USER MANAGEMENT ===
  getCurrentUser(): void {
    this.bookingService.getCurrentUser()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Errore nel caricamento dell\'utente:', error);
          alert('Errore nel caricamento dell\'utente. Riprova.');
          return of(null);
        })
      )
      .subscribe(user => {
        this.currentUser = user;
        // console.log('Utente corrente:', this.currentUser);
        this.showAdminPanel = user?.role === 'ADMIN';
      });
  }

  // === SCHEDULE MANAGEMENT ===
  getSchedule(): void {
    this.bookingService.schedule$
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error fetching schedules:', error);
          alert('Errore nel caricamento degli orari. Riprova.');
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(schedules => {
        this.schedules = schedules;
        this.updateSelectedSchedule();
        this.generateCalendar();
      });
  }

  updateSelectedSchedule(): void {
    let schedule = this.schedules.find(s => s.date === this.selectedDate);
    if (!schedule) {
      // Genero un GymSchedule di fallback se non esiste
      schedule = this.bookingService.createDaySchedule(this.selectedDate);
    }
    this.selectedSchedule = schedule;
  }

  loadSchedule(){
    this.getSchedule();
  }


// === CALENDAR MANAGEMENT ===
  generateCalendar(): void {
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    const startCalendar = new Date(firstDay);
    
    const dayOfWeek = firstDay.getDay();
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startCalendar.setDate(startCalendar.getDate() - offset);
    
    this.calendarDays = [];
    const current = new Date(startCalendar);
    const daysInMonth = lastDay.getDate();
    const totalDays = Math.ceil((daysInMonth + offset) / 7) * 7;
    
    for (let i = 0; i < totalDays; i++) {
      const dateString = current.toISOString().split('T')[0];
      const isCurrentMonth = current.getMonth() === this.currentMonth.getMonth();
      const schedule = this.schedules.find(s => s.date === dateString);
      const hasBookings = schedule ? schedule.timeSlots.some(slot => slot.bookings.length > 0) : false;
      
      this.calendarDays.push({
        date: dateString,
        isCurrentMonth,
        hasBookings,
        dayNumber: current.getDate()
      });
      
      current.setDate(current.getDate() + 1);
    }
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    this.updateSelectedSchedule();
    this.adminSelectedSlots = [];
    this.adminSlotAction = 'disable';
  }

  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  getMonthName(): string {
    return this.currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  }

  // === BOOKING OPERATIONS ===
  canUserBookSlot(startTime: string, endTime: string): boolean {
    if (!this.currentUser || this.currentUser.role !== 'CLIENT') return false;
    if (!this.selectedSchedule) return false;

    const slot = this.selectedSchedule.timeSlots.find(s => s.startTime === startTime && s.endTime === endTime);
    if (!slot || !slot.isAvailable || slot.currentBookings >= slot.maxCapacity) return false;

    if (!this.bookingService.canUserBook(this.selectedDate, startTime, this.currentUser)) return false;

    return this.bookingService.getUserBookingsForDate(this.selectedDate, this.currentUser.id).length === 0;
  }

  bookSlot(startTime: string, endTime: string): void {
    if (!this.currentUser) {
      alert('Utente non autenticato.');
      return;
    }

    this.bookingService.bookSlot(this.selectedDate, startTime, endTime, this.currentUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: success => {
          if (success) {
            alert('Prenotazione effettuata con successo!');
            this.loadSchedule();
          } else {
            alert('Errore durante la prenotazione. Riprova.');
          }
        },
        error: (error) => {
          alert(error.message || 'Errore durante la prenotazione. Riprova.');
        }
      });
  }

  cancelBooking(bookingId: number): void {
    // console.log('Cancellazione prenotazione con ID:', bookingId);
    if (confirm('Sei sicuro di voler cancellare questa prenotazione?')) {
      this.bookingService.cancelBooking(bookingId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: success => {
            if (success) {
              alert('Prenotazione cancellata con successo!');
              this.loadSchedule();
            } else {
              alert('Errore durante la cancellazione.');
            }
          },
          error: (error) => {
            alert(error.message || 'Errore durante la cancellazione.');
          }
        });
    }
  }

  getUserBookingForSlot(startTime: string, endTime: string): Booking | null {
    if (!this.selectedSchedule || !this.currentUser) return null;
    
    const slot = this.selectedSchedule.timeSlots.find(s => s.startTime === startTime && s.endTime === endTime);
    if (!slot) return null;
    
    return slot.bookings.find(b => b.userId === this.currentUser!.id) || null;
  }

  canUserBook(date: string, startTime: string): boolean {
    return this.bookingService.canUserBook(date, startTime, this.currentUser);
  }

  getUserBookingsForDate(date: string): Booking[] {
    if (!this.currentUser) return [];
    return this.bookingService.getUserBookingsForDate(date, this.currentUser.id);
  }

  // === FUNZIONI ADMIN ===

  // === ADMIN OPERATIONS ===
  toggleAdminPanel(): void {
    this.showAdminPanel = !this.showAdminPanel;
  }

  setAdminSlotAction(action: 'disable' | 'enable'): void {
    this.adminSlotAction = action;
    this.adminSelectedSlots = [];
  }

  toggleDayStatus(): void {
    if (!this.currentUser) {
      alert('Utente non autenticato.');
      return;
    }

    const newStatus = this.selectedSchedule?.isOpen ? 'CLOSE' : 'OPEN';
    
    if (confirm(`Sei sicuro di voler ${this.selectedSchedule?.isOpen ? 'chiudere' : 'aprire'} la palestra per il ${this.selectedDate}?`)) {
      this.bookingService.toggleDayStatus(this.selectedDate, this.currentUser, newStatus)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: success => {
            if (success) {
              alert(`Palestra ${newStatus} per il ${this.selectedDate}`);
              this.loadSchedule();
            } else {
              alert('Errore durante la modifica dello stato della palestra.');
            }
          },
          error: (error) => {
            alert(error.message || 'Errore durante la modifica dello stato della palestra.');
          }
        });
    }
  }

  toggleSlotSelection(startTime: string, endTime: string): void {
    if (this.isSlotPast(this.selectedDate, startTime)) {
      return;
    }
    
    const slotKey = `${startTime}-${endTime}`;
    const index = this.adminSelectedSlots.indexOf(slotKey);

    if (index > -1) {
      this.adminSelectedSlots.splice(index, 1);
    } else {
      this.adminSelectedSlots.push(slotKey);
    }
  }

  isSlotSelected(startTime: string, endTime: string): boolean {
    const slotKey = `${startTime}-${endTime}`;
    return this.adminSelectedSlots.includes(slotKey);
  }

  applySlotChanges(): void {
    if (!this.currentUser) {
      alert('Utente non autenticato.');
      return;
    }
  
    if (this.adminSelectedSlots.length === 0) {
      alert('Seleziona almeno uno slot.');
      return;
    }
  
    /* 
    console.log('Slots selezionati prima dell\'operazione:', this.adminSelectedSlots);
    console.log('Azione selezionata:', this.adminSlotAction);
    console.log('Stato attuale degli slot:', this.selectedSchedule?.timeSlots.map(s => ({
      slot: `${s.startTime}-${s.endTime}`,
      isAvailable: s.isAvailable,
      currentBookings: s.currentBookings,
      maxCapacity: s.maxCapacity
    })));
    */
  
    const actionText = this.adminSlotAction === 'disable' ? 'disabilitare' : 'abilitare';
    const confirmMessage = `Sei sicuro di voler ${actionText} ${this.adminSelectedSlots.length} slot selezionati?`;
  
    if (confirm(confirmMessage)) {
      const operation = this.adminSlotAction === 'disable' 
        ? this.bookingService.disableTimeSlots(this.selectedDate, this.adminSelectedSlots, this.currentUser)
        : this.bookingService.enableTimeSlots(this.selectedDate, this.adminSelectedSlots, this.currentUser);
  
      operation.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: success => {
            // console.log('Operazione completata:', success);
            if (success) {
              const successText = this.adminSlotAction === 'disable' ? 'disabilitati' : 'abilitati';
              alert(`Slot ${successText} con successo!`);
              this.adminSelectedSlots = [];
              
              /* 
              console.log('Stato degli slot dopo l\'operazione:', this.selectedSchedule?.timeSlots.map(s => ({
                slot: `${s.startTime}-${s.endTime}`,
                isAvailable: s.isAvailable,
                currentBookings: s.currentBookings,
                maxCapacity: s.maxCapacity
              })));
              */
            } else {
              alert('Errore durante l\'applicazione delle modifiche.');
            }
          },
          error: (error) => {
            console.error('Errore durante l\'operazione:', error);
            alert(error.message || 'Errore durante l\'applicazione delle modifiche.');
          }
        });
    }
  }

  isSlotDisabled(startTime: string, endTime: string): boolean {
    if (!this.selectedSchedule) return false;
    
    const slot = this.selectedSchedule.timeSlots.find(s => s.startTime === startTime && s.endTime === endTime);
    if (!slot) return false;
    
    return !slot.isAvailable && slot.currentBookings < slot.maxCapacity;
  }

  getDisabledSlotsCount(): number {
    if (!this.selectedSchedule) return 0;
    
    return this.selectedSchedule.timeSlots.filter(slot => 
      !slot.isAvailable && slot.currentBookings < slot.maxCapacity
    ).length;
  }

  getSelectableSlots(): string[] {
    if (!this.selectedSchedule) return [];
    
    return this.selectedSchedule.timeSlots
      .filter(slot => {
        const isPast = this.isSlotPast(this.selectedDate, slot.startTime);
        if (isPast) return false;
        
        if (this.adminSlotAction === 'disable') {
          return slot.isAvailable;
        } else {
          return !slot.isAvailable && slot.currentBookings < slot.maxCapacity;
        }
      })
      .map(slot => `${slot.startTime}-${slot.endTime}`);
  }


  // === UTILITY METHODS ===

  isDateInRange(date: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + this.MAX_BOOKING_DAYS_AHEAD);

    if (this.currentUser?.role === 'ADMIN') {
      maxDate.setDate(today.getDate() + this.MAX_BOOKING_DAYS_AHEAD + 7); 
    }
    
    return targetDate >= today && targetDate <= maxDate && !this.isSunday(targetDate);
  }

  isSunday(date: Date): boolean {
    return date.getDay() === 0;
  }

  isToday(date: string): boolean {
    return date === new Date().toISOString().split('T')[0];
  }

  isPastDate(date: string): boolean {
    return new Date(date) < new Date(new Date().toISOString().split('T')[0]);
  }

  isSlotPast(date: string, startTime: string): boolean {
    const today = new Date();
    const slotDateTime = new Date(date);
    const [hours, minutes] = startTime.split(':').map(Number);
    slotDateTime.setHours(hours, minutes, 0, 0);
    return slotDateTime < today;
  }

  getDayScheduleInfo(date: string): { isOpen: boolean; openTime: string; closeTime: string; dayName: string } {
    return this.bookingService.getDayScheduleInfo(date);
  }

  isWeekendOrClosed(date: string): boolean {
    const dayInfo = this.getDayScheduleInfo(date);
    return !dayInfo.isOpen;
  }

}