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

  updateList(title: string, description: string, public_view: string, public_edit: string) {
    this.list.title = title;
    this.list.description = description;
    this.list.public_edit = public_edit;
    console.log(public_edit);
    this.list.public_view = public_view;
    console.log(public_view);
    this.taskService.updateList(this.list).subscribe(() => {
      //return to lists/list._id
      this.router.navigate(['/lists', this.listId]);
    });
  }

  cancelBack() {
    this.router.navigate(['/lists']);
  }

  stringToBoolean(string: string) {
    switch (string.toLowerCase()) { case "false": case "no": case "0": case "": return false; default: return true; }
  }

}
