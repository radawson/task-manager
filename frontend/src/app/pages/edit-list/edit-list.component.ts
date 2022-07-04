import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { List } from 'src/app/models/list.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-list',
  templateUrl: './edit-list.component.html',
  styleUrls: ['./edit-list.component.scss']
})
export class EditListComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) { }

  listId!: string;
  list!: List;

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        if (params['listId']) {
          this.listId = params['listId'];
          this.taskService.getList(this.listId).subscribe((lists: any) => {
            this.list = lists;
          })
        }
      })
  }

  updateList(title: string, description: string) {
    this.list.title = title;
    this.list.description = description;
    this.taskService.updateList(this.listId, this.list).subscribe(() => {
      //return to lists/list._id
      this.router.navigate(['/lists', this.listId]);
    });
  }

  cancelBack() {
    this.router.navigate(['/lists']);
  }

}
