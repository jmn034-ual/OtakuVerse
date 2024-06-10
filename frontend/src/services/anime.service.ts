import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map, mergeMap, of, shareReplay, tap } from 'rxjs';
import { AnimeApi } from '../interfaces/animeApi';
import { Anime } from '../interfaces/anime';
import { OtakuList } from '../interfaces/OtakuList';
import { Categories } from '../interfaces/categories';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {

  private apiUrl = 'https://kitsu.io/api/edge/anime'; // URL de la API
  private backendUrl = 'http://localhost:8081/api/data'; // URL del backend

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  
  
  constructor(private http: HttpClient) { }

  getAnime(id: string): Observable<AnimeApi> {
    return this.http.get<AnimeApi>(`${this.apiUrl}/${id}`).pipe(
      map((response: any) => response.data) // Mapea solo la propiedad 'data' de la respuesta
    );;
  }

  getAnimes(page : number, size : number): Observable<AnimeApi[]> {
    return this.http.get<any>(`${this.apiUrl}?page%5Bnumber%5D= ${page}&page%5Bsize%5D= ${size}`).pipe(
      map((response: any) => response.data) // Mapea solo la propiedad 'data' de la respuesta
    );
  }

  getTrendingAnimes(): Observable<AnimeApi[]> {
    return this.http.get<AnimeApi[]>(`https://kitsu.io/api/edge/trending/anime`).pipe(
      map((response: any) => response.data) // Mapea solo la propiedad 'data' de la respuesta
    );
  }

  getCategory(): Observable<Categories> {
    return this.http.get<any>('https://kitsu.io/api/edge/categories');
  }

  getAnimesByCategory(category: string, page: number, size: number): Observable<AnimeApi[]> {
    return this.http.get<any>(`${this.apiUrl}?filter%5Bcategories%5D=${category}&page%5Bnumber%5D=${page}&page%5Bsize%5D= ${size}`).pipe(
      map((response: any) => response.data) // Mapea solo la propiedad 'data' de la respuesta
    );
  }

  getFavs(): Observable<AnimeApi[]> {
    return this.http.get<AnimeApi[]>(`${this.backendUrl}/favs`).pipe(
      mergeMap(favs => {
        // Crear un array de observables que obtienen los detalles de cada anime
        const observables = favs.map(anime => this.getAnime(anime.id));
        
        // Combinar todos los observables en uno solo
        return forkJoin(observables);
      })
    );
  }

  addFav(anime: AnimeApi): Observable<Anime>{
    const animeFav : Anime = {id: anime.id.toString(), name: anime.attributes.canonicalTitle.toString()};
    return this.http.post<Anime>(`${this.backendUrl}/save`, animeFav, this.httpOptions);
  }
  
  searchAnimes(term: string): Observable<AnimeApi[]> {
    if (!term.trim()) {
      return of([]); // Si no hay término de búsqueda, retorna un observable vacío
    }
    return this.http.get<{ data: AnimeApi[] }>(`${this.apiUrl}?filter[text]=${term}`)
      .pipe(
        map(response => response.data)
      );
  }

  deleteFav(anime: AnimeApi): Observable<AnimeApi> {
    return this.http.delete<AnimeApi>(`${this.backendUrl}/deletefav/${anime.id}`, this.httpOptions);
  }

  isFav(anime: AnimeApi): Observable<boolean> {
    return this.getFavs().pipe(
      map(favs => favs.some(fav => fav.id === anime.id.toString()))
    );
  }

  createList(list: OtakuList): Observable<OtakuList> {
    return this.http.post<OtakuList>(`${this.backendUrl}/createlist`, list, this.httpOptions);
  }

  getOtakuLists(): Observable<OtakuList[]> {
    return this.http.get<OtakuList[]>(`${this.backendUrl}/getOtakuLists`);
  }

  getOtakuList(id: string): Observable<OtakuList> {
    return this.http.get<OtakuList>(`${this.backendUrl}/getOtakuList/${id}`);
  }

  deleteList(list: OtakuList): Observable<OtakuList> {
    return this.http.delete<OtakuList>(`${this.backendUrl}/deleteList/${list.id}`, this.httpOptions);
  }

  updateList(list: OtakuList): Observable<OtakuList> {
    return this.http.put<OtakuList>(`${this.backendUrl}/updateOtakuList`, list, this.httpOptions);
  }

  getWinners(): Observable<{ [key: string]: string[] }> {
    return this.http.get<{ [key: string]: string[] }>('http://localhost:8081/api/data/scrapping')
      .pipe(
        shareReplay()
      );
  }

  getAnimeByName(term: string): Observable<AnimeApi | undefined> {
    if (!term.trim()) {
      return of(undefined); // Si no hay término de búsqueda, retorna un observable con valor undefined
    }
    return this.http.get<{ data: AnimeApi[] }>(`${this.apiUrl}?filter[text]=${term}`)
      .pipe(
        map(response => response.data[0]) // Retorna solo el primer elemento de la lista de animes
      );
  }
  
}
