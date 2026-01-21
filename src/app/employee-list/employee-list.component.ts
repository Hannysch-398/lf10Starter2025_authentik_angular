import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Employee } from "../Employee";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees$: Observable<Employee[]>;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.employees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    const token = this.authService.getAccessToken();
    this.employees$ = this.http.get<Employee[]>('http://localhost:8089/employees', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `eyJhbGciOiJSUzI1NiIsImtpZCI6ImQxNjBhNjAwMTY5YmEwYTY5MDQ2NDZmYTY2ZGFiZmY0IiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkwMDAvYXBwbGljYXRpb24vby9lbXBsb3llZV9hcGkvIiwic3ViIjoiYWQyMzdlNGU0MTQwNmUzNzIwNjFhYjhkZjkxOTE4MWI2ZTViMWM3Mzg5MTAwMjBlNDgyOTRiNDRkYmRhOTRmYSIsImF1ZCI6ImVtcGxveWVlX2FwaV9jbGllbnQiLCJleHAiOjE3Njc5ODA1ODMsImlhdCI6MTc2Nzk3NzU4MywiYXV0aF90aW1lIjoxNzY3OTc3NTgzLCJhY3IiOiJnb2F1dGhlbnRpay5pby9wcm92aWRlcnMvb2F1dGgyL2RlZmF1bHQiLCJhenAiOiJlbXBsb3llZV9hcGlfY2xpZW50IiwidWlkIjoidWhUem1MRDFBcFllRDJnckxhZnVhS3lzbXg2azFmMllaeUhzUTRBayJ9.vwNqmOIPk-2YRrj4zZrVYgwBEG9eCOiEF9MnxFrqEQxSbilWrquxz2OMeZRpVqmKkQy5HN5ag0qfLhrsIqGSW8k7rAOVpasG-JATIg7lYU6xVJqPZY5TCC1pK3Cm-5iP4iZtY0UvoD_s0Y7AwJaALNSRAtoS-RwPHEd5CsEYuuVseUcLhxIp7_t_LWioX1S85wMZjyyrkkW_D_Y5tgqORA30buZcq7w-gPdMUgmwQytuzjpub0CCBoQJWwDpgKGE-BnNwceVDC1vxjJQ1C5EP3eQU11XhhxNNDVqCQnHdTwYzfzTTRCX6KFAFhcwg337_bAAODHhKofekKTEojr2ZCAnEzg6hlhf7Vi2a8Gsra4JhYvYgR6gbNibocJPrCUeB15LgJdYVqoNByrp25kH7aHNYZIU5Kt308iqNjrlMVl2fqZ08A8BDXUpdont31PmxYXNqrrnpRXcoHMyjKjgvRvHIoXIfUweFXn1kuCYIGMNzoVtRhDYHbvPWWoBaeiAiBhv3lTqLBetj_V_BvYPC5q3vmYDffsrh47bkpRj29jYITydEKMta9Jd-G0z8Uwj6awv2xua3Y70wZTJnmyfE3vbK9TeuLq0AZKSIBiezBuptwiIAeoOgie_xiqw66PtIcKcfQHqOn0O-EwYe4Vj2c6tvsPR5TnrTLqlqdpMyJE`)
    });
  }

}
