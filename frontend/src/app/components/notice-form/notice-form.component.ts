import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Notice } from '../../model/notice-types';

@Component({
  selector: 'app-notice-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notice-form.component.html',
  styleUrls: ['./notice-form.component.css']
})
export class NoticeFormComponent {
  @Output() noticeCreated = new EventEmitter<Omit<Notice, 'id' | 'createdAt' | 'likes' | 'likedByCurrentUser'>>();

  showForm = false;
  isSubmitting = false;
  
  formData = {
    title: '',
    description: '',
    important: false
  };

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.formData = {
      title: '',
      description: '',
      important: false
    };
    this.showForm = false;
    this.isSubmitting = false;
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    
    setTimeout(() => {
      this.noticeCreated.emit({
        title: this.formData.title.trim(),
        description: this.formData.description.trim(),
        important: this.formData.important
      });
      
      this.resetForm();
    }, 500);
  }
}