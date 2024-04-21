import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrl: './subscriber.component.css',
})
export class SubscriberComponent implements OnInit {
  subscribers$!: Observable<any>;
  constructor(private subServices: SubscribersService) {}
  ngOnInit(): void {
    this.subscribers$ = this.subServices.loadData();
    console.log(this.subscribers$);
  }

  onDelete(id: string) {
    this.subServices.deleteData(id);
  }
}
