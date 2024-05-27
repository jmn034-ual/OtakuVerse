import { Component, Input, OnInit } from '@angular/core';
import { AnimeService } from '../services/anime.service';
import { Anime } from '../interfaces/anime';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-anime',
  imports: [NgIf],
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.scss']
})
export class AnimeComponent implements OnInit {
  @Input() anime: Anime | undefined;
  //anime: Anime | undefined;

  constructor(private animeService: AnimeService) { }

  ngOnInit(): void {
    /*this.animeService.getAnime('11').subscribe(
      (data: Anime) => this.anime = data,
      (error) => console.error('Error fetching anime data', error)
    );*/
  }
}
