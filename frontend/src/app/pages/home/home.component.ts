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

  list!: List;
  tasks!: Task[];
  taskView: boolean = false;
  day!: String;

  constructor(private taskService: TaskService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    this.day = weekday[d.getDay()];

    this.taskService.getListByName(this.day).subscribe((lists: any) => {
      this.list = lists;
    })
    if (this.list) {
      this.taskService.getTasks(this.list._id).subscribe((tasks: any) => {
        this.tasks = tasks;
        this.taskView = true;
        console.log(this.list.title);
      })
    }
  }

  onTaskClick(task: Task) {
    this.taskService.complete(task).subscribe(() => {
      task.completed = !task.completed;
    });
  }
}


