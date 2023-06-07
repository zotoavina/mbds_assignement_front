import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  log(assignmentName:string, action:string) {
    console.log("LOGGING SERVICE : Assignment " + assignmentName + " " + action);
  }
}
