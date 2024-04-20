import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../../models/post';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css',
})
export class NewPostComponent implements OnInit {
  //permalink: string = '';
  imgSrc: any = './assets/img/placeholder.jpg';
  selectedImg: any;
  categories!: Array<any>;

  postForm!: FormGroup;

  formStatus: string = 'Add New Post';

  docId: string = '';

  constructor(
    private categoryService: CategoriesService,
    private postService: PostsService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((val) => {
      this.docId = val['id'];
      if (this.docId) {
        this.postService.loadSinglePost(val['id']).subscribe((data) => {
          this.postForm = this.fb.group({
            title: [
              data.title,
              [Validators.required, Validators.minLength(10)],
            ],
            permalink: [data.permalink, Validators.required],
            excerpt: [
              data.excerpt,
              [Validators.required, Validators.minLength(50)],
            ],
            category: [
              `${data.category.categoryId}-${data.category.category}`,
              Validators.required,
            ],
            postImg: ['', Validators.required],
            content: ['data.content', Validators.required],
          });

          this.imgSrc = data.postImgPath;
          this.formStatus = 'Edit Post';
        });
      } else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: ['', Validators.required],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required],
        });
      }
    });
  }
  ngOnInit(): void {
    this.categoryService.loadData().subscribe((data) => {
      this.categories = data;
    });
  }

  get fc() {
    return this.postForm.controls;
  }

  onTitleChanged($event: any) {
    const title = $event.target.value;
    const permalink = title.replace(/\s/g, '-');
    this.postForm.patchValue({ permalink: permalink });
  }

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    };

    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

  onSubmit() {
    let cate = this.postForm.value.category.split('-');

    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: cate[0],
        category: cate[1],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'draft',
      createdAt: new Date(),
    };

    this.postService.uploadImage(
      this.selectedImg,
      postData,
      this.formStatus,
      this.docId
    );
    this.postForm.reset();
    this.imgSrc = './assets/img/placeholder.jpg';
  }
}
