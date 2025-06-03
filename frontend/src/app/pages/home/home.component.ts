// home-page.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementsCarouselComponent } from '../../components/announcements-carousel/announcements-carousel.component';
import { FeaturesSectionComponent } from '../../components/features-section/features-section.component';
import { HeroSectionComponent } from '../../components/hero-section/hero-section.component';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FooterComponent } from '../../components/footer/footer.component';
import { InfoSectionComponent } from '../../components/info-section/info-section.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    AnnouncementsCarouselComponent,
    FeaturesSectionComponent,
    HeroSectionComponent,
    FooterComponent,
    InfoSectionComponent,
    CommonModule],
  standalone: true
})
export class HomeComponent {
}