export interface Notice {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    important: boolean;
    likes: number;
    likedByCurrentUser?: boolean;
  }
  
  export enum UserRole {
    ADMIN = 'admin',
    TRAINER = 'trainer',
    CLIENT = 'client',
  }
  