import { Injectable } from '@angular/core';
import { List } from './models/list.model';
import { Task } from './models/task.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }

  // Lists

  createList(title: string) {
    // Create a new list with title
    return this.webReqService.post('lists', { title });
  }

  deleteList(listId: String) {
    return this.webReqService.delete(`lists/${listId}`);
  }

  getList(listId: String) {
    return this.webReqService.get(`lists/${listId}`);
  }

  getLists() {
    return this.webReqService.get('lists');
  }

  updateList(listId: string, list: List) {
    // Create a new list with title
    return this.webReqService.patch(`lists/${listId}`, list);
  }

  // Tasks

  createTask(listId: string, title: string) {
    // Create a new list with title
    return this.webReqService.post(`lists/${listId}/tasks/`, { title });
  }

  deleteTask(task: Task) {
    return this.webReqService.delete(`lists/${task._listId}/tasks/${task._id}`);
  }

  // returns a single task by ID
  getTask(listId: string, taskId: string) {
    return this.webReqService.get(`lists/${listId}/tasks/${taskId}`);
  }

  // Returns all tasks in a list
  getTasks(listId: string) {
    return this.webReqService.get(`lists/${listId}/tasks`);
  }

  updateTask(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, task);
  }

  complete(task: Task) {
    return this.webReqService.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }


}
