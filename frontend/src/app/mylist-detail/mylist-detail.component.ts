import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../../services/anime.service';
import { OtakuList } from '../../interfaces/OtakuList';
import { AnimeApi } from '../../interfaces/animeApi';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { iif } from 'rxjs';

@Component({
  selector: 'app-mylist-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, UpperCasePipe],
  templateUrl: './mylist-detail.component.html',
  styleUrl: './mylist-detail.component.scss'
})
export class MylistDetailComponent implements OnInit{
  animes: AnimeApi[] = [];
  activeTab: string = 'favoritos';
  menuVisible: string | null = null;
  isCreateListModalVisible: boolean = false;
  listToRename: OtakuList | null = null; 
  initialListName: string = ''; 
  lista: OtakuList | undefined;
  
  constructor(private animeService: AnimeService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getOtakuList();
  }

  getOtakuList() : void{
    const id = this.route.snapshot.paramMap.get('id')!;
    this.animeService.getOtakuList(id).subscribe({
      next: (data: OtakuList) => {
        this.lista = data;
        for(let anime of data.animes){
          this.animeService.getAnime(anime.id).subscribe({
            next: (data: AnimeApi) => {
              this.animes.push(data);
            },
            error: (error) => console.error('Error fetching anime', error)
          });
        }
      },
      error: (error) => console.error('Error fetching otaku lists', error)
    }); 
  }

  deleteAnime(anime: AnimeApi): void {
    if(this.lista){
      this.lista.animes = this.lista.animes.filter(a => a.id !== anime.id);
      this.animeService.updateList(this.lista).subscribe({
        next: () => {
          this.animes = this.animes.filter(a => a.id !== anime.id);
        },
        error: (error) => console.error('Error deleting anime', error)
      });
    }
  }

}
