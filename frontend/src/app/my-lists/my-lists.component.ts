import { Component, OnInit } from '@angular/core';
import { AnimeService } from '../../services/anime.service';
import { AnimeApi } from '../../interfaces/animeApi';
import { NgFor } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CreateListModalComponent } from '../create-list-modal/create-list-modal.component';
import { OtakuList } from '../../interfaces/OtakuList';

interface List {
  title: string;
  items: number[];
  updated: Date;
}

@Component({
  selector: 'app-my-lists',
  standalone: true,
  imports: [NgFor, CommonModule, RouterLink, CreateListModalComponent, RouterLink],
  templateUrl: './my-lists.component.html',
  styleUrl: './my-lists.component.scss'
})
export class MyListsComponent implements OnInit {
  animes: AnimeApi[] = [];
  activeTab: string = 'favoritos';
  menuVisible: string | null = null;
  isCreateListModalVisible: boolean = false;
  listToRename: OtakuList | null = null; 
  initialListName: string = ''; 
  lists: OtakuList[] = [ ];


  constructor(private animeService: AnimeService) { }

  ngOnInit(): void {
    this.getFavs();
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


  getFavs() {
    this.animeService.getFavs().subscribe({
      next: (data: AnimeApi[]) => {
        this.animes = data;
      },
      error: (error) => console.error('Error fetching anime data', error)
    });
  }

  deleteFavs(anime: AnimeApi) {
    this.animeService.deleteFav(anime).subscribe({
      next: () => {
         this.getFavs();
         window.location.reload(); 
      },
      error: (error) => { console.error('Error deleting anime', error) }
    });
  }

  toggleMenu(event: MouseEvent, menu: string): void {
    event.stopPropagation();
    this.menuVisible = this.menuVisible === menu ? null : menu;
  }

  onBackgroundClick(event: MouseEvent): void {
    if (this.menuVisible) {
      this.menuVisible = null;
    }
  }

  renameList(list: OtakuList): void {
    this.listToRename = list;
    this.initialListName = list.title; 
    this.isCreateListModalVisible = true;
  }

  deleteList(list: OtakuList): void {
    const index = this.lists.indexOf(list);
    if (index > -1) {
      this.animeService.deleteList(list).subscribe({ 
        next: () => {
          this.lists.splice(index, 1);
        },
        error: (error) => console.error('Error deleting list', error)
      });
    }
    this.menuVisible = null;
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.menuVisible = null;
  }

  closeCreateListModal(): void {
    this.isCreateListModalVisible = false;
    this.listToRename = null;
    this.initialListName = ''; 
  }

  addList(title: string): void {
    if (this.listToRename) {
      const index = this.lists.indexOf(this.listToRename);
      if (index > -1 && !this.lists.some(list => list.title === title)) {
        this.lists[index].title = title;
        this.lists[index].updated = new Date();
        this.animeService.updateList(this.lists[index]).subscribe({
          next: () => {
            this.getOtakuLists();
          },
          error: (error) => console.error('Error updating list', error)
        });
      } else if (this.lists.some(list => list.title === title)) {
        alert('Ya existe una lista con este nombre.');
        return;
      }
    } else {
      if (this.lists.length >= 10) {
        alert('No puedes crear más de 10 listas.');
        return;
      }
      if (this.lists.some(list => list.title === title)) {
        alert('Ya existe una lista con este nombre.');
        return;
      }
      this.animeService.createList({ title, animes: [], updated: new Date() }).subscribe({
        next: (data: OtakuList) => {
          this.lists.push(data);
        },
        error: (error) => console.error('Error creating list', error)
      });
   //   this.lists.push({ title, animes: [], updated: new Date() });
    }
    this.closeCreateListModal();
  }

  showCreateListModal(): void {
    this.isCreateListModalVisible = true;
  }
}
