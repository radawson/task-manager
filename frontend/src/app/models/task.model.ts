export class Task {
    _id: string = "";
    _listId: string = "";
    title: string = "";
    description: string = "";
    completed: boolean = false;
    completed_date: Date = new Date();
    public: boolean = true;
}