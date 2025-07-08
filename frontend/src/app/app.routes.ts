import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/main-register/main-register.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { NoticesComponent } from './pages/notices/notices.component';
import { GymBookingComponent } from './pages/gym-booking/gym-booking.component';
//import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'personal', component: UserProfileComponent },
    { path: 'notices', component: NoticesComponent },
    { path: 'bookings', component: GymBookingComponent },
    { path: '**', redirectTo: '/home' } 
  ];
