import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';


const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type':  'application/json',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
		'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization',
		"Accept": "application/json",
		'X-CMC_PRO_API_KEY': 'b464a459-f2e6-4633-908f-6d7b9463aeed'
	})
};

@Injectable({
	providedIn: 'root'
})

export class HttpconfigService {

	authSubject  =  new  BehaviorSubject(false);


	constructor(private http: HttpClient) { }

	postConfig(url: string, data: any) {
		return this.http.post<any>(url, data, httpOptions)
			.pipe(
				tap((res:  any ) => {
					if(res){
						this.authSubject.next(true);
					}
				}),
				catchError(this.handleError) // then handle the error
			);
	}

	getConfig(url: string) {
		return this.http.get<any>(url, httpOptions)
			.pipe(
				map(res => { return res}),
				catchError(this.handleError)
			);
	}

	private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong.
			console.error(
			`Backend returned code ${error.status}, ` +
			`body was: ${error.error}`);
		}
		// Return an observable with a user-facing error message.
		return throwError(
			'Something bad happened; please try again later.');
	}

}

