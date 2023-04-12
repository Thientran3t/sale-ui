import { Component, AfterViewInit, ViewChild } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from './api.service';
export interface SaleData {
  salesDate: any;
  storeName: string;
  productName: string;
  salesUnit: number;
  salesRevenue: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements AfterViewInit {

  constructor(private appService: ApiService) { };

  title = 'sale-management';
  dataSource = new MatTableDataSource<SaleData>();
  displayedColumns: string[] = ['salesDate', 'storeName', 'productName', 'salesUnit', 'salesRevenue'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.initializeWebSocketConnection();
    this.appService.callApiTest().subscribe(() => {
      console.log("Trigger fetch data");
    })
  }

  public stompClient: any;

  initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:8081/vnet-websocket';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, (frame: any) => {
      this.stompClient.subscribe('/vnet', (message: any) => {
        if (message.body) {
          this.dataSource.data = this.dataSource.data.concat(JSON.parse(message.body));
        }
      });
    });
  }
}
