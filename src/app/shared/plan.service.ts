import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from './appSettings';

@Injectable({
  providedIn: 'root'
})

export class PlanStateService {

  constructor(private http: HttpClient) { }

  getPlan(): any {
    return JSON.parse(localStorage.getItem('user_plan'));
  }

  isAvaliable(): boolean {
    return this.getPlan().user_should_renew == null;
  }

  // Ask Stripe
  request_url(data): Observable<any> {
    return this.http.post(AppSettings.backendURL+'api/stripe/request_url', data);
  }
}