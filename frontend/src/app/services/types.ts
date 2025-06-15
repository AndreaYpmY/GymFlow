export type UserRole = 'ADMIN' | 'TRAINER' | 'CLIENT' | null;

export interface User {
  id: number;
  email: string;
  password?: string; 
  fiscalCode: string;
  name: string;
  surname: string;
  role: UserRole;
  dateOfBirth: string;
}

export interface UserProfile {
  email: string;
  password?: string; 
  fiscalCode: string;
  name: string;
  surname: string;
  role: UserRole;
  dateOfBirth: string;
}
  
export interface UserForAdmin {
  id: number;
  email: string;
  fiscalCode: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  registrationCode: string;
  active: boolean;
  verified: boolean;
  role: string;
  createdAt: string;
}

export interface PaginatedResponse {
  content: UserForAdmin[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface Pageable {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}
  
export interface verifyCodeResponse {
  user: User;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

export interface VerificationCodeResponse {
  email: string;
  role: UserRole;
}

export interface finishRegistrationUserRequest{
  password: string; 
  name: string;
  surname: string;
  dateOfBirth: string;
}


export interface CreateUserRequest {
  email: string;
  fiscalCode: string;
  role: UserRole;
}
export interface UserFormData {
  email: string;
  fiscalCode: string;
  role: string;
  subscriptionEndDate?: string | null;
  weeklyHours?: {
    monday: number;
    tuesday: number;
    wednesday: number;
    thursday: number;
    friday: number;
    saturday: number;
    sunday: number;
  };
}

export interface CreateUserResponse {
  registrationCode: string;
}