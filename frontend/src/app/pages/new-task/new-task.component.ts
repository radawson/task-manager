import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute) {  }

  listId!: string;

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.listId = params['listId'];
      }
    )
  }

  createTask(title: string) {
    this.taskService.createTask(this.listId, title).subscribe((newTask: any) => {
    console.log(newTask);
    //return to lists/_response._id
    this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  cancelBack(){
    this.router.navigate(['/lists'], { relativeTo: this.route });
  }

}
