import { Component, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable } from 'rxjs';
import { Category } from '../../category/models/category.model';


@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit{
  model: AddBlogPost;
  categpries$?: Observable<Category[]>

  constructor(private blogpostService: BlogPostService, private router: Router, private categoryService: CategoryService){
    this.model = {
      title: '',
      shortDescription: '',
      urlHandle: '',
      content: '',
      featuredImageUrl: '',
      author: '',
      isVisible: true,
      publishedDate: new Date(),
      categories: []
    }
  }
  ngOnInit(): void {
   this.categpries$ = this.categoryService.getAllCategories();
  }
  onFormSubmit() : void{
     this.blogpostService.createBlogPost(this.model).subscribe({
    next: (reponse) =>{
      this.router.navigateByUrl('/admin/blogposts')
      console.log(reponse);
    }
     })
  }
}
