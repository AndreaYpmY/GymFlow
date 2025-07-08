  export interface User {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'TRAINER' | 'CLIENT';
  }

  export interface Schedule {
    bookings: Booking[];
    disabledTimeSlots: TimeSlotDisabled[]; // Array di orari disabilitati dall'admin
  }
  
  export interface Booking {
    id: number;
    userId: number;
    userName?: string;
    date: string; // YYYY-MM-DD format
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    createdAt: string | Date;
  }
  
  export interface TimeSlot {
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    maxCapacity: number;
    currentBookings: number;
    isAvailable: boolean;
    bookings: Booking[];
  }

  export interface TimeSlotDisabled {
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    date: string; // YYYY-MM-DD format
  }
  
  export interface GymSchedule {
    date: string; // YYYY-MM-DD format
    isOpen: boolean;
    openTime: string; // HH:mm format
    closeTime: string; // HH:mm format
    timeSlots: TimeSlot[];
    disabledSlots: string[]; // Array di orari disabilitati dall'admin o
  }
  