import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) { }

  listId!: string;
  taskId!: string;
  task!: Task;

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        if (params['listId'] && params['taskId']) {
          this.listId = params['listId'];
          this.taskId = params['taskId'];
          this.taskService.getTask(this.listId, this.taskId).subscribe((task: any) => {
            this.task = task;
          })
        }
      })
  }

  updateTask(title: string, description: string) {
    this.task.title = title;
    this.task.description = description;
    this.taskService.updateTask(this.task).subscribe(() => {
      //return to lists/list._id
      this.router.navigate(['/lists', this.task._listId]);
    });
  }

  cancelBack() {
    this.router.navigate(['/lists']);
  }

}
