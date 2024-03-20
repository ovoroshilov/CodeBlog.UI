import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../category/services/category.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../../category/models/category.model';
import { ImageService } from 'src/app/shared/components/image-selector/service/image.service';



@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})
export class AddBlogpostComponent implements OnInit, OnDestroy {
  model: AddBlogPost;
  categpries$?: Observable<Category[]>

  isImgSelectorVisible: boolean = false
  imgSelectSub?: Subscription
  constructor(private blogpostService: BlogPostService, private router: Router,
    private categoryService: CategoryService, private imageService: ImageService) {
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
  ngOnDestroy(): void {
    this.imgSelectSub?.unsubscribe()
  }
  ngOnInit(): void {
    this.categpries$ = this.categoryService.getAllCategories();
    this.imgSelectSub = this.imageService.onSelectImage().subscribe({
      next: (res) => {
        if (this.model) {
          this.model.featuredImageUrl = res.url
          this.isImgSelectorVisible = false
        }
      }
    })
  }
  onFormSubmit(): void {
    this.blogpostService.createBlogPost(this.model).subscribe({
      next: (reponse) => {
        this.router.navigateByUrl('/admin/blogposts')
        console.log(reponse);
      }
    })
  }

  openImgSelectorWindow(): void {
    this.isImgSelectorVisible = true;
  }

  closeImgSelectorWindow(): void {
    this.isImgSelectorVisible = false;
  }
}
