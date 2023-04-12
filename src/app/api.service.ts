import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  callApiTest() {
    const serverUrl = 'http://localhost:8080/vnet/test';
    return this.httpClient.get(serverUrl);
  }

}