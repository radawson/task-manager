import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  lists!: List[];
  tasks!: Task[];
  taskView: boolean = false;
  day: String = "Sunday";

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    this.day = weekday[d.getDay()];

    this.route.params.subscribe(
      (params: Params) => {
        console.log(params);
        if (params['listId']) {
          this.taskService.getTasks(params['listId']).subscribe((tasks: any) => {
            this.tasks = tasks;
            this.taskView = true;
          })
        }
      })
  }

  onTaskClick(task: Task) {
    this.taskService.complete(task).subscribe(() => {
      task.completed = !task.completed;
    });
  }
}


