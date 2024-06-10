import { Component, Input, OnInit } from '@angular/core';
import { AnimeService } from '../../services/anime.service';
import { AnimeApi } from '../../interfaces/animeApi';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AddToListModalComponent } from '../add-to-list-modal/add-to-list-modal.component';
import { OtakuList } from '../../interfaces/OtakuList';
import { Anime } from '../../interfaces/anime';



@Component({
  standalone: true,
  selector: 'app-anime',
  imports: [NgIf, RouterLink, NgClass, AddToListModalComponent],
  templateUrl: './anime.component.html',
  styleUrls: ['./anime.component.scss']
})
export class AnimeComponent implements OnInit {
  @Input() anime: AnimeApi | undefined;
  isFavorite: boolean = false;
  isCreateListModalVisible: boolean = false;
  isAddToListModalVisible: boolean = false;
  selectedAnime: AnimeApi | null = null;

  lists: OtakuList[] = [];

  constructor(
    private animeService: AnimeService) { }

  ngOnInit(): void {
    this.isFav(this.anime!);
    this.getOtakuLists();
  }

  getOtakuLists(){
    this.animeService.getOtakuLists().subscribe({
      next: (data: OtakuList[]) => {
        this.lists = data;
      },
      error: (error) => console.error('Error fetching otaku lists', error)
    }); 
  }

  addFav(anime: AnimeApi): void {
    if(!this.isFavorite){
      this.animeService.addFav(anime).subscribe({
        next: (response) => {
          this.isFavorite = true;
          console.log('Anime added to favorites', response);
        },
        error: (error) => {
          console.error('There was an error!', error);
        }
      });
    }else{
      this.animeService.deleteFav(anime).subscribe({
        next: (response) => {
          this.isFavorite = false;
          console.log('Anime removed from favorites', response);
        },
        error: (error) => {
          console.error('There was an error!', error);
        }
      });
    }
    
  }

  isFav(anime: AnimeApi): void {
    this.animeService.isFav(anime).subscribe({
      next: (response) => {
        this.isFavorite = response;
      }
    });
  }

  showAddToListModal(anime: AnimeApi): void {
    this.selectedAnime = anime;
    this.isAddToListModalVisible = true;
  }

  closeAddToListModal(): void {
    this.isAddToListModalVisible = false;
  }

  handleAddToList(event: { list: OtakuList, anime: AnimeApi }): void {
    const { list, anime} = event;
    const targetList = this.lists.find(l => l.title === list.title);
    const targetAnime = { id: anime.id.toString(), name: anime.attributes.canonicalTitle.toString() };
    if (targetList) {
      const animeExists = targetList.animes.some(a => a.id === targetAnime.id);
      if (!animeExists) {
        targetList.animes.push(targetAnime);
        targetList.updated = new Date();
        this.animeService.updateList(targetList).subscribe({
          next: (response) => {
            console.log('Anime added to list', response);
            this.getOtakuLists();
          },
          error: (error) => {
            console.error('There was an error!', error);
          }
        });
      } else {
        alert('El anime ya está en la lista');
      }
    }
  }
 
}
