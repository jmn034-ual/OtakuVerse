import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../../services/anime.service';
import { AnimeApi } from '../../interfaces/animeApi';
import { AnimeComponent } from '../anime/anime.component';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PortadaComponent } from '../portada/portada.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AnimeComponent, NgFor, NgIf, RouterLink, PortadaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  animes: AnimeApi[] = [] ;
  currentIndex: number = 0;
  page : number = 1;
  size : number = 10;
  disabled: boolean = false;

  constructor(private animeService: AnimeService) {}

  ngOnInit(): void {
    this.getAnimes();
  }

  getAnimes(): void {
    this.animeService.getAnimes(this.page, this.size).subscribe(
      (data: AnimeApi[]) => {
        this.animes = data;
      },
      (error) => console.error('Error fetching anime data', error)
    );
  }

  next(): void {
    if (this.currentIndex < this.animes.length - 5) {
      this.currentIndex += 5;
      this.disabled = true;
    }else if(this.currentIndex == this.animes.length - 5){
      this.page += 1;
      this.getAnimes();
      this.currentIndex = 0;
    }
  }

  prev(): void {
    if (this.currentIndex > 0 ) {
      this.currentIndex -= 5;
      if(this.currentIndex == 0 && this.page == 1){
        this.disabled = false;
      }
    }else if(this.currentIndex == 0 && this.page > 1){
      this.disabled = true;
      this.page -= 1;
      this.getAnimes();
      this.currentIndex = this.animes.length - 5;
    }
  }
}

