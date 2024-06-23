import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'http://localhost:3000/api/movies';

  constructor(private http: HttpClient) {}

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getItemById(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  createItem(item: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', item.title);
    formData.append('director', item.director);
    formData.append('genres', JSON.stringify(item.genres));
    formData.append('year', item.year.toString());
    formData.append('rating', item.rating.toString());
    formData.append('description', item.description);
    formData.append('duration', item.duration.toString());
    formData.append('language', item.language);
    formData.append('releaseDate', item.releaseDate);

    return this.http.post<any>(this.apiUrl, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateItem(id: string, item: any, file: File | null): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const formData = new FormData();

    if (file) {
      formData.append('image', file);
    }
    formData.append('title', item.title);
    formData.append('director', item.director);
    formData.append('genres', JSON.stringify(item.genres));
    formData.append('year', item.year.toString());
    formData.append('rating', item.rating.toString());
    formData.append('description', item.description);
    formData.append('duration', item.duration.toString());
    formData.append('language', item.language);
    formData.append('releaseDate', item.releaseDate);

    return this.http.put<any>(url, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteItem(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
