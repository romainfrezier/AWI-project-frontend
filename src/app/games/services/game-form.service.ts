import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GameFormService {
  constructor(private http: HttpClient) {}
}
