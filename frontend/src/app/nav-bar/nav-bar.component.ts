import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AnimeService } from '../../services/anime.service';
import { AnimeApi } from '../../interfaces/animeApi';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  searchQuery: string = '';
  animes$!: Observable<AnimeApi[]>;
  private searchTerms = new Subject<string>();

  constructor(private router: Router, private animeService: AnimeService) {}

  ngOnInit(): void {
    this.animes$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.animeService.searchAnimes(term))
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  goToAnime(animeId: string): void {
    this.router.navigate(['/anime', animeId]).then(() => {
      window.location.reload(); // Forzar recarga de la página
    });
  }
}
