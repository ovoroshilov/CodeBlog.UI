import { Component, OnInit } from '@angular/core';
import { BlogPostService } from '../services/blog-post.service';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blogpost-list',
  templateUrl: './blogpost-list.component.html',
  styleUrls: ['./blogpost-list.component.css']
})
export class BlogpostListComponent implements OnInit{
blogPost$?: Observable<BlogPost[]>;

  constructor(private service: BlogPostService, private router: Router){}

  ngOnInit(): void {
   this.blogPost$ = this.service.getAllBlogPosts()
  }
}
