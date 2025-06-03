export type UserRole = 'Admin' | 'Trainer' | 'Client' | null;

export interface User {
  id: number;
  email: string;
  fiscalCode: string;
  name: string;
  surname: string;
  role: UserRole;
  birthDate: string;
  isActive: boolean;
  isVerified: boolean;
}
