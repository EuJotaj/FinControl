import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  standalone: false
})
export class CategoryFormComponent {
  categoryForm: FormGroup;

  icons = ['restaurant', 'directions_car', 'account_balance_wallet', 'sports_esports', 'medical_services', 'school', 'shopping_cart', 'movie', 'fitness_center'];
  colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#64748B'];

  constructor(
    private fb: FormBuilder, 
    private modalService: ModalService,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      type: ['EXPENSE', Validators.required],
      icon: ['category', Validators.required],
      color: ['#3B82F6', Validators.required]
    });
  }

  save() {
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: () => {
          window.location.reload();
          this.modalService.close();
        },
        error: (err) => {
          console.error('Error saving category:', err);
          alert('Erro ao salvar categoria.');
        }
      });
    }
  }

  cancel() {
    this.modalService.close();
  }
}
