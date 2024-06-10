import { Component, Input, OnInit } from '@angular/core';
import { AnimeApi } from '../../interfaces/animeApi';
import { NgFor, NgIf, NgStyle } from '@angular/common'; // Importa CommonModule
import { RouterLink } from '@angular/router';
import { AnimeService } from '../../services/anime.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-portada',
  standalone: true,
  imports: [NgStyle, RouterLink, NgIf, NgFor],
  templateUrl: './portada.component.html',
  styleUrl: './portada.component.scss'
})
export class PortadaComponent implements OnInit{
  anime: AnimeApi | undefined;
  winners: { [key: string]: string[] } = {};
  animeWinners: AnimeApi[] = [];
  private subscription: Subscription | undefined;
  currentWinnerIndex = 0;



  constructor(private animeService: AnimeService) {}
  
  ngOnInit(): void {
      this.getWinners();
  }

  

    getWinners(): void {
      this.animeService.getWinners().subscribe(
        (data) => {
          this.winners = data;
          for (let value of Object.values(this.winners)) {
            const winnerAnime = value[0]; // Obtener el primer anime de cada ganador
            this.animeService.getAnimeByName(winnerAnime).subscribe(
              (firstAnime: AnimeApi | undefined) => { // Cambiar el tipo de datos esperado en el callback
                if (firstAnime) { // Verificar si se encontró un anime
                  this.animeWinners.push(firstAnime);
                } else {
                  console.error('No se encontró el primer anime del ganador');
                }
              },
              (error) => console.error('Error fetching winner data', error)
            );
          }
        },
        (error) => console.error('Error fetching winners data', error)
      );
    }
    

}
