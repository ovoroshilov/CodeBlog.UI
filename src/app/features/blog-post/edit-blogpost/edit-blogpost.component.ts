import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { ImageSelectorComponent } from 'src/app/shared/components/image-selector/image-selector.component';
import { ImageService } from 'src/app/shared/components/image-selector/service/image.service';

@Component({
  selector: 'app-edit-blogpost',
  standalone: true,
  imports: [FormsModule, CommonModule, MarkdownModule, ImageSelectorComponent],
  templateUrl: './edit-blogpost.component.html',
  styleUrl: './edit-blogpost.component.css'
})
export class EditBlogpostComponent implements OnInit, OnDestroy {

  id: string | null = null

  model: BlogPost | null = null
  routeSub?: Subscription

  categories$?: Observable<Category[]>
  selectedCategories?: string[]

  isImgSelectorVisible: boolean = false

  updatePostSub?: Subscription
  getPostSub?: Subscription
  deletePostSub?: Subscription
  imgSelectSub?: Subscription
  constructor(private route: ActivatedRoute, private service: BlogPostService,
    private categoryService: CategoryService, private router: Router, private imageService: ImageService) { }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();

    this.routeSub = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id')

        if (this.id) {
          this.getPostSub = this.service.getBlogPostById(this.id).subscribe({
            next: (response) => {
              this.model = response
              this.selectedCategories = response.categories.map(x => x.id)
            }
          })
        }

        this.imgSelectSub = this.imageService.onSelectImage().subscribe({
          next: (res) => {
            if (this.model) {
              this.model.featuredImageUrl = res.url
              this.isImgSelectorVisible = false
            }
          }
        })
      }
    })
  }

  onFormSubmit(): void {
    if (this.model && this.id) {
      var updateBlogPost: UpdateBlogPost = {
        author: this.model.author,
        content: this.model.content,
        shortDescription: this.model.shortDescription,
        featuredImageUrl: this.model.featuredImageUrl,
        isVisible: this.model.isVisible,
        publishedDate: this.model.publishedDate,
        urlHandle: this.model.urlHandle,
        title: this.model.title,
        categories: this.selectedCategories ?? []
      }
      this.updatePostSub = this.service.updateBlogPost(this.id, updateBlogPost).subscribe({
        next: (response) => {
          this.router.navigateByUrl("/admin/blogposts");
        }
      })
    }
  }

  openImgSelectorWindow(): void {
    this.isImgSelectorVisible = true;
  }

  closeImgSelectorWindow(): void {
    this.isImgSelectorVisible = false;
  }

  onDelete(): void {
    if (this.id) {
      this.deletePostSub = this.service.deleteBlogPost(this.id).subscribe({
        next: (response) => {
          this.router.navigateByUrl('/admin/blogposts');
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe()
    this.updatePostSub?.unsubscribe()
    this.getPostSub?.unsubscribe()
    this.deletePostSub?.unsubscribe()
    this.imgSelectSub?.unsubscribe()
  }
}
