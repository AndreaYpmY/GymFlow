
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notice, UserRole } from '../../model/notice-types';

@Component({
  selector: 'app-notice-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notice-card.component.html',
  styleUrls: ['./notice-card.component.css']
})
export class NoticeCardComponent {
  @Input() notice!: Notice;
  @Input() userRole!: UserRole;
  @Output() delete = new EventEmitter<string>();
  @Output() like = new EventEmitter<string>();

  readonly UserRole = UserRole;

  onDelete(): void {
    if (confirm('Sei sicuro di voler eliminare questo avviso?')) {
      this.delete.emit(this.notice.id);
    }
  }

  onLike(): void {
    this.like.emit(this.notice.id);
  }
}