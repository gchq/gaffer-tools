import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PostService } from './post.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  providers: [PostService]
})

export class PostsComponent {

  items: Observable<Array<string>>;
  term = new FormControl();

  constructor (private postService: PostService) {
    this.items = postService.search(this.term.valueChanges);
  }
}
