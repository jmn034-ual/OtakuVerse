import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { Anime } from '../interfaces/anime';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  private apiUrl = 'https://kitsu.io/api/edge/anime'; // URL de la API

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getAnime(id: string): Observable<Anime> {
    return this.http.get<Anime>(`${this.apiUrl}/${id}`);
  }

  getAnimes(): Observable<Anime[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response: any) => response.data) // Mapea solo la propiedad 'data' de la respuesta
    );
  }
}
