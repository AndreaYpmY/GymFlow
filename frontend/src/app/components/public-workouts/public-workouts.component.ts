// public-workouts.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule


interface Workout {
  id: number;
  title: string;
  description: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzato';
  duration: string;
  exercises: number;
  instructor: string;
  image: string;
}

@Component({
  selector: 'app-public-workouts',
  templateUrl: './public-workouts.component.html',
  styleUrls: ['./public-workouts.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PublicWorkoutsComponent {

  featuredWorkouts: Workout[] = [
    {
      id: 1,
      title: 'Scheda Full-Body',
      description: 'Allenamento completo per tutto il corpo, perfetto per chi ha poco tempo.',
      level: 'Intermedio',
      duration: '45 min',
      exercises: 8,
      instructor: 'Marco Rossi',
      image: 'assets/images/workout-fullbody.jpg'
    },
    {
      id: 2,
      title: 'Scheda Principianti',
      description: 'Ideale per chi inizia il percorso fitness. Movimenti base e progressioni.',
      level: 'Principiante',
      duration: '30 min',
      exercises: 6,
      instructor: 'Sara Bianchi',
      image: 'assets/images/workout-beginner.jpg'
    },
    {
      id: 3,
      title: 'Forza Avanzata',
      description: 'Programma intensivo per sviluppare forza e massa muscolare.',
      level: 'Avanzato',
      duration: '60 min',
      exercises: 10,
      instructor: 'Luca Verdi',
      image: 'assets/images/workout-advanced.jpg'
    }
  ];

  getLevelClass(level: string): string {
    const levelClasses = {
      'Principiante': 'level-beginner',
      'Intermedio': 'level-intermediate',
      'Avanzato': 'level-advanced'
    };
    return levelClasses[level as keyof typeof levelClasses] || '';
  }

  onWorkoutClick(workout: Workout): void {
    console.log('Workout clicked:', workout.title);
    // Implementare navigazione alla scheda specifica
  }

  onExploreAll(): void {
    console.log('Explore all workouts');
    // Implementare navigazione alla pagina con tutte le schede
  }
}