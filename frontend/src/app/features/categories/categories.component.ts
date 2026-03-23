import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Category } from '../../core/models/transaction.model';
import { ModalService } from '../../shared/services/modal.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  standalone: false
})
export class CategoriesComponent implements OnInit {
  incomeCategories$: Observable<Category[]> | undefined;
  expenseCategories$: Observable<Category[]> | undefined;

  constructor(
    private categoryService: CategoryService,
    private modalService: ModalService
  ) {}

  openAddCategory(): void {
    this.modalService.open({ title: 'Nova Categoria', type: 'category' });
  }

  ngOnInit(): void {
    const categories$ = this.categoryService.getCategories();
    this.incomeCategories$ = categories$.pipe(map(cats => cats.filter(c => c.type === 'INCOME')));
    this.expenseCategories$ = categories$.pipe(map(cats => cats.filter(c => c.type === 'EXPENSE')));
  }
}
