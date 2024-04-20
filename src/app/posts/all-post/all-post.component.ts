import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrl: './all-post.component.css',
})
export class AllPostComponent implements OnInit {
  postArray$!: Observable<any>;

  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.postArray$ = this.postService.loadData();
  }

  onDelete(postId: string, postImgPath: string) {
    this.postService.deletePost(postId, postImgPath);
  }

  onFeatured(postId: string, isFeatured: boolean) {
    const featureData = {
      isFeatured: isFeatured,
    };
    this.postService.updateData(postId, featureData);
  }
}
