import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Anime } from '../interfaces/anime';
import { AnimeComponent } from '../anime/anime.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AnimeComponent, NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  animes: Anime[] = [] ;
  currentIndex: number = 0;

  constructor(private animeService: AnimeService) {}

  ngOnInit(): void {
    this.animeService.getAnimes().subscribe(
      (data: Anime[]) => {
        this.animes = data;
      },
      (error) => console.error('Error fetching anime data', error)
    );
  }

  next(): void {
    if (this.currentIndex < this.animes.length - 5) {
      this.currentIndex += 5;
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex -= 5;
    }
  }
}

