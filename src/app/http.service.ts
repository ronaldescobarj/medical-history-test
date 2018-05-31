import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {
    baseUrl: string = 'http://localhost:3000/api';
    constructor(private http: Http) { }

    public get(url: string) {
        return this.http.get(encodeURI(this.baseUrl + url))
            .map((response) => {
                return response.json();
            })
            .catch(handleError);
    }

    public post(url: string, params: any) {
        return this.http.post(encodeURI(this.baseUrl + url), params)
            .map((response) => {
                return response.json();
            })
            .catch(handleError);
    }

}

function handleError(error: any) {
    alert('An error occurred:\n' + error);
    console.error('An error occurred: ', error);
    return Observable.throw(error.message || error);
}