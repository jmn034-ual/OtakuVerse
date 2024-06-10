import { NgFor, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AnimeComponent } from '../anime/anime.component';
import { AnimeApi } from '../../interfaces/animeApi';
import { AnimeService } from '../../services/anime.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Categories } from '../../interfaces/categories';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-anime',
  standalone: true,
  imports: [NgFor, AnimeComponent, RouterLink, FormsModule, UpperCasePipe],
  templateUrl: './list-anime.component.html',
  styleUrl: './list-anime.component.scss'
})
export class ListAnimeComponent implements OnInit {
  animes: AnimeApi[] = [] ;
  currentIndex: number = 0;
  page : number = 1;
  size : number = 20;
  disabled: boolean = false;
  category: string = '';
  categories : string[] = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mecha', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'];
  selectedCategory: string = '';

  constructor(
    private route: ActivatedRoute,
    private animeService: AnimeService) {}

    ngOnInit(): void {
      this.category = this.route.snapshot.paramMap.get('category')!;
     //S this.getCategory();
      this.loadAnimes();
    }

    loadAnimes(): void {
      if (this.selectedCategory === 'all') {
        this.getAnimes();
      } else {
        this.getAnimesByCategory();
      }
    }

    onCategoryChange(): void {
      this.page = 1;
      this.category = this.selectedCategory;
      this.loadAnimes();
    }
    
  getAnimesByCategory() {
    this.animeService.getAnimesByCategory(this.category, this.page, this.size).subscribe(
      (data: AnimeApi[]) => {
        this.animes = data;
      },
      (error) => console.error('Error fetching anime data', error)
    );
  }

  getAnimes(): void {
    
    this.animeService.getAnimes(this.page, this.size).subscribe(
      (data: AnimeApi[]) => {
        this.animes = data;
      },
      (error) => console.error('Error fetching anime data', error)
    );
  }

  nextPage(): void {
    this.page++;
    if(this.category === 'all'){
      this.getAnimes();
    }else{
      this.getAnimesByCategory();
    }
  }

  prevPage(): void {
    if(this.page > 1){
      this.page--;
      if(this.category === 'all'){
      this.getAnimes();
      }else{
        this.getAnimesByCategory();
      }
    }
      
  }

 
}
