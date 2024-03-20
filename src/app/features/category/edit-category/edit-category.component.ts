import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { UpdateCategoryRequest } from '../models/update-category-request';
import { ImageService } from 'src/app/shared/components/image-selector/service/image.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css']
})
export class EditCategoryComponent implements OnInit, OnDestroy {
 id: string | null = null;
 paramsSub?: Subscription;
 editSub?: Subscription;
 category?: Category;

 constructor(private route: ActivatedRoute,  private service: CategoryService,
   private router: Router,){}
 
  
  ngOnInit(): void {
   this.paramsSub = this.route.paramMap.subscribe({
    next: (params) => {
      this.id = params.get('id');

      if(this.id){
         this.service.getCategoryById(this.id).subscribe({
          next: (response) => {
            this.category = response;
          }
         });
      }
    }
   });
  }

 onFormSubmit() : void {
   const updateCategoryRequest: UpdateCategoryRequest ={
    name: this.category?.name ?? '',
    urlHandle: this.category?.urlHandle ?? ''
   };
   if(this.id){
   this.editSub = this.service.updateCategory(this.id, updateCategoryRequest).subscribe({
      next: () =>{
        this.router.navigateByUrl('/admin/categories')
      }
    });
   }
  }

  onDelete(){
    if(this.id){
    this.service.deleteCategory(this.id).subscribe({
      next: (response) =>{
        this.router.navigateByUrl('admin/categories ~')
      }
    });
    }
  }

  ngOnDestroy(): void {
    this.paramsSub?.unsubscribe;
    this.editSub?.unsubscribe;
  }
}
