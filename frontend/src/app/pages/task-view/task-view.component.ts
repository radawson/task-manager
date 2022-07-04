import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/models/task.model';
import { List } from 'src/app/models/list.model';
import { faCog, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  faCog = faCog;
  faEdit = faEdit;
  faTrash = faTrash;

  lists!: List[];
  tasks!: Task[];
  taskView: boolean = false;

  selectedListId!: string;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.taskService.getLists().subscribe((lists: any) => {
      this.lists = lists;
    })

    this.route.params.subscribe(
      (params: Params) => {
        console.log(params);
        if (params['listId']) {
          this.selectedListId = params['listId'];
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

  // Lists

  onDeleteListClick() {
    this.taskService.deleteList(this.selectedListId).subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['/lists']);
    })
  }

  onEditListClick() {
    this.router.navigate(['/edit-list', this.selectedListId]);
  }

  //Tasks

  onDeleteTaskClick(task: Task) {
    this.taskService.deleteTask(task).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== task._id);
      console.log(res);
    })
  }

  onEditTaskClick(task: Task) {
    this.router.navigate([`/lists/${task._listId}/edit-task`, task._id]);
  }



}
