import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, take, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User, GymSchedule, TimeSlot, Booking, Schedule, TimeSlotDisabled } from '../model/booking-types';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private scheduleSubject = new BehaviorSubject<GymSchedule[]>([]);
  public schedule$ = this.scheduleSubject.asObservable();

  // === CONFIGURATION ===
  private readonly MAX_BOOKING_DAYS_AHEAD = 14;
  private readonly SLOT_DURATION = 60; // minuti per slot
  private readonly MAX_CAPACITY_PER_SLOT = 20;
  private readonly API_URL = 'http://localhost:8080/api/bookings';

  // Orari differenziati per giorno della settimana
  private readonly WEEKLY_SCHEDULE = {
    0: { isOpen: false, openTime: '00:00', closeTime: '00:00' }, // Domenica - Chiusa
    1: { isOpen: true, openTime: '06:00', closeTime: '22:00' },  // Lunedì
    2: { isOpen: true, openTime: '06:00', closeTime: '22:00' },  // Martedì
    3: { isOpen: true, openTime: '06:00', closeTime: '22:00' },  // Mercoledì
    4: { isOpen: true, openTime: '06:00', closeTime: '22:00' },  // Giovedì
    5: { isOpen: true, openTime: '06:00', closeTime: '22:00' },  // Venerdì
    6: { isOpen: true, openTime: '08:00', closeTime: '20:00' }   // Sabato
  };

  constructor(private http: HttpClient) {}

  // === USER MANAGEMENT ===
  getCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${this.API_URL}/current-user`, { withCredentials: true })
      .pipe(
        take(1),
        catchError(error => {
          console.error('Errore nel caricamento utente:', error);
          return of(null);
        })
      );
  }

  // === SCHEDULE INITIALIZATION ===
  initializeSchedule(): void {
    // console.log('Inizializzazione dello schedule...');
    const today = new Date();
    const endDate = new Date(today.getTime() + this.MAX_BOOKING_DAYS_AHEAD * 24 * 60 * 60 * 1000);
    const startDateStr = today.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    const schedules = this.generateScheduleRange(startDateStr, endDateStr);
    const params = new HttpParams()
      .set('start', startDateStr)
      .set('end', endDateStr);

    this.http.get<Schedule>(`${this.API_URL}/schedule`, { params, withCredentials: true })
      .pipe(
        take(1),
        catchError(this.handleError),
        tap(schedule => {
          // console.log('Prenotazioni caricate:', schedule);
          this.integrateBookingsIntoSchedules(schedules, schedule);
          // console.log('Schedule inizializzato con prenotazioni:', schedules);
          this.scheduleSubject.next(schedules);
        })
      )
      .subscribe();
  }

  private generateScheduleRange(startDate: string, endDate: string): GymSchedule[] {
    const schedules: GymSchedule[] = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      schedules.push(this.createDaySchedule(dateStr));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedules;
  }

  private integrateBookingsIntoSchedules(schedules: GymSchedule[], schedule: Schedule): void {
    // Integra le prenotazioni
    schedule.bookings.forEach(booking => {
      const normalizedBooking = {
        ...booking,
        date: this.normalizeDate(booking.date),
        startTime: this.normalizeTime(booking.startTime),
        endTime: this.normalizeTime(booking.endTime)
      };

      const targetSchedule = schedules.find(s => s.date === normalizedBooking.date);
      if (targetSchedule && targetSchedule.isOpen) {
        const slot = targetSchedule.timeSlots.find(
          s => s.startTime === normalizedBooking.startTime && s.endTime === normalizedBooking.endTime
        );
        if (slot) {
          // console.log(`Integrating booking ${booking.id} into slot ${slot.startTime}-${slot.endTime} on ${booking.date}`);
          slot.bookings.push(booking);
          slot.currentBookings = slot.bookings.length;
          slot.isAvailable = slot.currentBookings < slot.maxCapacity;
        }
      }
    });

    // Integra i time slots disabilitati
    schedule.disabledTimeSlots.forEach(disabledSlot => {
      const normalized = {
        date: this.normalizeDate(disabledSlot.date),
        startTime: this.normalizeTime(disabledSlot.startTime),
        endTime: this.normalizeTime(disabledSlot.endTime)
      };

      const targetSchedule = schedules.find(s => s.date === normalized.date);
      if (targetSchedule) {
        const slot = targetSchedule.timeSlots.find(
          s => s.startTime === normalized.startTime && s.endTime === normalized.endTime
        );
        if (slot) {
          slot.isAvailable = false;
          // console.log(`Slot ${slot.startTime}-${slot.endTime} on ${normalized.date} disabilitato`);
        }
      }
    });

    // Aggiorna lo stato isOpen basandosi sugli slot disponibili
    schedules.forEach(schedule => {
      const allSlotsDisabled = schedule.timeSlots.every(slot => !slot.isAvailable);
      if (allSlotsDisabled && schedule.timeSlots.length > 0) {
        schedule.isOpen = false;
        // console.log(`Schedule per ${schedule.date} impostato come chiuso: tutti gli slot sono disabilitati`);
      }
    });
  }

  // === SCHEDULE UTILITIES ===
  getScheduleForDate(date: string): GymSchedule | null {
    return this.scheduleSubject.value.find(s => s.date === date) || null;
  }

  createDaySchedule(date: string): GymSchedule {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay() as keyof typeof this.WEEKLY_SCHEDULE;
    const daySchedule = this.WEEKLY_SCHEDULE[dayOfWeek];

    const schedule: GymSchedule = {
      date,
      isOpen: daySchedule.isOpen,
      openTime: daySchedule.openTime,
      closeTime: daySchedule.closeTime,
      timeSlots: [],
      disabledSlots: []
    };

    if (daySchedule.isOpen) {
      schedule.timeSlots = this.generateTimeSlots(daySchedule.openTime, daySchedule.closeTime);
    }

    return schedule;
  }

  private generateTimeSlots(openTime: string, closeTime: string): TimeSlot[] {
    const slots: TimeSlot[] = [];
    let currentTime = this.parseTime(openTime);
    const endTime = this.parseTime(closeTime);

    while (currentTime < endTime) {
      const nextTime = new Date(currentTime.getTime() + this.SLOT_DURATION * 60000);

      if (nextTime <= endTime) {
        slots.push({
          startTime: this.formatTime(currentTime),
          endTime: this.formatTime(nextTime),
          maxCapacity: this.MAX_CAPACITY_PER_SLOT,
          currentBookings: 0,
          isAvailable: true,
          bookings: []
        });
      }

      currentTime = nextTime;
    }

    return slots;
  }

  getDayScheduleInfo(date: string): { isOpen: boolean; openTime: string; closeTime: string; dayName: string } {
    const schedule = this.getScheduleForDate(date);
    if (schedule) {
      return {
        isOpen: schedule.isOpen,
        openTime: schedule.openTime,
        closeTime: schedule.closeTime,
        dayName: this.getDayName(date)
      };
    }

    // Fallback usando la configurazione settimanale
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay() as keyof typeof this.WEEKLY_SCHEDULE;
    const daySchedule = this.WEEKLY_SCHEDULE[dayOfWeek];

    return {
      isOpen: daySchedule.isOpen,
      openTime: daySchedule.openTime,
      closeTime: daySchedule.closeTime,
      dayName: this.getDayName(date)
    };
  }

  // === BOOKING OPERATIONS ===
  bookSlot(date: string, startTime: string, endTime: string, user: User): Observable<boolean> {
    if (user.role !== 'CLIENT') {
      return throwError(() => new Error('Solo i clienti possono prenotare slot'));
    }

    if (this.getUserBookingsForDate(date, user.id).length > 0) {
      return throwError(() => new Error('Hai già una prenotazione per questo giorno'));
    }

    const booking: Partial<Booking> = { date, startTime, endTime };

    return this.http.post<number>(`${this.API_URL}/done`, booking, { withCredentials: true })
      .pipe(
        map((id) => {
          this.updateLocalScheduleAfterBooking(date, startTime, endTime, user, id);
          return true;
        }),
        catchError(this.handleError)
      );
  }

  cancelBooking(bookingId: number): Observable<boolean> {
    return this.http.delete<void>(`${this.API_URL}/delete/${bookingId}`, { withCredentials: true })
      .pipe(
        map(() => {
          this.updateLocalScheduleAfterCancellation(bookingId);
          return true;
        }),
        catchError(this.handleError)
      );
  }

  private updateLocalScheduleAfterBooking(date: string, startTime: string, endTime: string, user: User, bookingId: number): void {
    const schedules = this.scheduleSubject.value;
    const schedule = schedules.find(s => s.date === date);
    
    if (schedule) {
      const slot = schedule.timeSlots.find(s => s.startTime === startTime && s.endTime === endTime);
      if (slot) {
        const newBooking: Booking = {
          id: bookingId,
          userId: user.id,
          userName: user.name,
          date,
          startTime,
          endTime,
          createdAt: new Date().toISOString()
        };

        slot.bookings.push(newBooking);
        slot.currentBookings = slot.bookings.length;
        slot.isAvailable = slot.currentBookings < slot.maxCapacity;
      }
    }

    this.scheduleSubject.next([...schedules]);
  }

  private updateLocalScheduleAfterCancellation(bookingId: number): void {
    const schedules = this.scheduleSubject.value;
    
    schedules.forEach(schedule => {
      schedule.timeSlots.forEach(slot => {
        slot.bookings = slot.bookings.filter(b => b.id !== bookingId);
        slot.currentBookings = slot.bookings.length;
        slot.isAvailable = slot.currentBookings < slot.maxCapacity;
      });
    });

    this.scheduleSubject.next([...schedules]);
  }

  // === ADMIN OPERATIONS ===
  toggleDayStatus(date: string, user: User, currentStatus: string): Observable<boolean> {
    if (user.role !== 'ADMIN') {
      return throwError(() => new Error('Solo gli admin possono modificare lo stato dei giorni'));
    }

    if (this.isPastDate(date)) {
      return throwError(() => new Error('Non puoi modificare date passate'));
    }

    const newStatus = currentStatus === 'OPEN' ? false : true;

    return this.http.put<void>(`${this.API_URL}/schedules/${date}/toggle/${newStatus}`, {}, { withCredentials: true })
      .pipe(
        map(() => {
          this.updateLocalDayStatus(date);
          return true;
        }),
        catchError(this.handleError)
      );
  }

  disableTimeSlots(date: string, timeSlots: string[], user: User): Observable<boolean> {
    if (user.role !== 'ADMIN') {
      return throwError(() => new Error('Solo gli admin possono disabilitare slot'));
    }

    if (this.isPastDate(date)) {
      return throwError(() => new Error('Non puoi modificare slot passati'));
    }

    return this.http.put<void>(
      `${this.API_URL}/schedules/${date}/slots/disable`,
      { timeSlots },
      { withCredentials: true }
    ).pipe(
      map(() => {
        this.updateLocalSlotsStatus(date, timeSlots, false);
        return true;
      }),
      catchError(this.handleError)
    );
  }

  enableTimeSlots(date: string, timeSlots: string[], user: User): Observable<boolean> {
    if (user.role !== 'ADMIN') {
      return throwError(() => new Error('Solo gli admin possono abilitare slot'));
    }

    if (this.isPastDate(date)) {
      return throwError(() => new Error('Non puoi modificare slot passati'));
    }

    return this.http.put<void>(
      `${this.API_URL}/schedules/${date}/slots/enable`,
      { timeSlots },
      { withCredentials: true }
    ).pipe(
      map(() => {
        this.updateLocalSlotsStatus(date, timeSlots, true);
        return true;
      }),
      catchError(this.handleError)
    );
  }

  private updateLocalDayStatus(date: string): void {
    const schedules = this.scheduleSubject.value;
    const schedule = schedules.find(s => s.date === date);
    
    if (schedule) {
      schedule.isOpen = !schedule.isOpen;
      if (!schedule.isOpen) {
        schedule.timeSlots = [];
      } else {
        schedule.timeSlots = this.generateTimeSlots(schedule.openTime, schedule.closeTime);
      }
    }

    this.scheduleSubject.next([...schedules]);
  }

  private updateLocalSlotsStatus(date: string, timeSlots: string[], enable: boolean): void {
    const schedules = this.scheduleSubject.value;
    const schedule = schedules.find(s => s.date === date);
    
    if (schedule) {
      schedule.timeSlots.forEach(slot => {
        const slotKey = `${slot.startTime}-${slot.endTime}`;
        if (timeSlots.includes(slotKey)) {
          slot.isAvailable = enable ? slot.currentBookings < slot.maxCapacity : false;
          // console.log(`Aggiornato slot ${slotKey} per ${date}: isAvailable = ${slot.isAvailable}`);
          if (!enable) {
            slot.bookings = [];
            slot.currentBookings = 0;
          }
        }
      });

      // Aggiorna lo stato generale della giornata
      const allSlotsDisabled = schedule.timeSlots.every(slot => !slot.isAvailable);
      if (allSlotsDisabled && schedule.timeSlots.length > 0) {
        schedule.isOpen = false;
      } else if (schedule.timeSlots.some(slot => slot.isAvailable)) {
        schedule.isOpen = true;
      }

      // Gestisci disabledSlots array
      if (enable) {
        schedule.disabledSlots = schedule.disabledSlots.filter(slot => !timeSlots.includes(slot));
      } else {
        timeSlots.forEach(slot => {
          if (!schedule.disabledSlots.includes(slot)) {
            schedule.disabledSlots.push(slot);
          }
        });
      }
    }

    this.scheduleSubject.next([...schedules]);
  }

  // === BOOKING VALIDATION ===
  canUserBook(date: string, startTime: string, user: User | null): boolean {
    if (!user || user.role !== 'CLIENT') return false;

    const today = new Date();
    const bookingDate = new Date(date);
    const maxDate = new Date(today.getTime() + this.MAX_BOOKING_DAYS_AHEAD * 24 * 60 * 60 * 1000);

    if (!startTime) {
      return bookingDate >= today && bookingDate <= maxDate;
    }

    const [hours, minutes] = startTime.split(':').map(Number);
    const slotDateTime = new Date(bookingDate);
    slotDateTime.setHours(hours, minutes, 0, 0);
    
    return slotDateTime > today && slotDateTime <= maxDate;
  }

  canUserBookSlot(date: string, startTime: string, endTime: string, user: User | null): boolean {
    if (!user || user.role !== 'CLIENT') return false;

    const schedule = this.getScheduleForDate(date);
    if (!schedule || !schedule.isOpen) return false;

    const slot = schedule.timeSlots.find(s => s.startTime === startTime && s.endTime === endTime);
    if (!slot || !slot.isAvailable || slot.currentBookings >= slot.maxCapacity) return false;

    if (!this.canUserBook(date, startTime, user)) return false;

    return this.getUserBookingsForDate(date, user.id).length === 0;
  }

  getUserBookingsForDate(date: string, userId: number): Booking[] {
    const schedule = this.getScheduleForDate(date);
    if (!schedule) return [];

    const userBookings: Booking[] = [];
    schedule.timeSlots.forEach(slot => {
      slot.bookings.forEach(booking => {
        if (booking.userId === userId) {
          userBookings.push(booking);
        }
      });
    });

    return userBookings;
  }

  getUserBookingForSlot(date: string, startTime: string, endTime: string, userId: number): Booking | null {
    const schedule = this.getScheduleForDate(date);
    if (!schedule) return null;

    const slot = schedule.timeSlots.find(s => s.startTime === startTime && s.endTime === endTime);
    if (!slot) return null;

    // console.log(`Prenotazioni per slot ${startTime}-${endTime}:`, slot.bookings, 'User ID:', userId);
    return slot.bookings.find(b => b.userId === userId) || null;
  }

  // === UTILITY METHODS ===
  getDayName(date: string): string {
    const dateObj = new Date(date);
    const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    return dayNames[dateObj.getDay()];
  }

  isPastDate(date: string): boolean {
    const today = new Date();
    const targetDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    return targetDate < today;
  }

  isSlotPast(date: string, startTime: string): boolean {
    const now = new Date();
    const slotDateTime = new Date(date);
    const [hours, minutes] = startTime.split(':').map(Number);
    slotDateTime.setHours(hours, minutes, 0, 0);
    return slotDateTime < now;
  }

  // === PRIVATE UTILITIES ===
  private normalizeTime(time: string): string {
    const parts = time.split(':');
    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1]?.substring(0, 2) || '00';
    return `${hours}:${minutes}`;
  }

  private normalizeDate(date: string): string {
    return date.split('T')[0];
  }

  private parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  // === ERROR HANDLING ===
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'Si è verificato un errore. Riprova più tardi.';
    
    if (error.status === 400) {
      errorMessage = 'Richiesta non valida. Controlla i dati inseriti.';
    } else if (error.status === 401) {
      errorMessage = 'Non autorizzato. Effettua il login.';
    } else if (error.status === 403) {
      errorMessage = 'Non hai i permessi necessari per questa operazione.';
    } else if (error.status === 404) {
      errorMessage = 'Risorsa non trovata.';
    } else if (error.status === 409) {
      errorMessage = 'Conflitto: l\'operazione non può essere completata.';
    }

    console.error('Errore HTTP:', error);
    return throwError(() => new Error(errorMessage));
  };
}