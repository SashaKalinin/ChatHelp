import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PostService} from '../shared/services/post.service';
import {switchMap} from 'rxjs/operators';
import {Post} from '../../environments/interface';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Constants} from "../../environments/constants";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.less']
})
export class EditPageComponent implements OnInit {
  form: FormGroup;
  dir = new FormControl();
  dirList: string[] = Constants.dirArr;
  constructor(
    private rout: ActivatedRoute,
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.rout.params
      .pipe(
        switchMap((params: Params) => {
          return this.postService.getById(params.id);
        })
      ).subscribe( (post: Post) => {
        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required)
        });
    });
  }

  return(): void {
    this.router.navigate(['posts']);
  }

  submit() {

  }
}
