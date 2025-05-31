import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementsCarouselComponent } from './announcements-carousel.component';

describe('AnnouncementsCarouselComponent', () => {
  let component: AnnouncementsCarouselComponent;
  let fixture: ComponentFixture<AnnouncementsCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementsCarouselComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
