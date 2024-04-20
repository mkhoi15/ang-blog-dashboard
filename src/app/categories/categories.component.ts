import { CategoriesService } from './../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Category } from '../models/category';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  categories$!: Observable<any>;
  formCategory: any;
  formStatus: string = 'Add';
  categoryId: string = '';

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categories$ = this.categoriesService.loadData();
  }

  onSubmit(formData: NgForm) {
    let categoryData: Category = {
      category: formData.value.category,
    };

    if (this.formStatus == 'Add') {
      this.categoriesService.saveData(categoryData);
      formData.reset();
    } else if (this.formStatus == 'Edit') {
      this.categoriesService.updateData(this.categoryId, categoryData);
      formData.reset();
      this.formStatus = 'Add';
    }
  }

  onEdit(id: any, category: any) {
    this.categoryId = id;
    this.formCategory = category;
    this.formStatus = 'Edit';
  }

  onDelete(id: any) {
    this.categoriesService.deleteData(id);
  }
}
