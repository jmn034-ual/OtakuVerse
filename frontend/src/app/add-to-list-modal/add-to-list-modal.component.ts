import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OtakuList } from '../../interfaces/OtakuList';
import { FormsModule } from '@angular/forms';
import { Anime } from '../../interfaces/anime';
import { AnimeApi } from '../../interfaces/animeApi';
import { NgFor, NgIf } from '@angular/common';
import { CreateListModalComponent } from '../create-list-modal/create-list-modal.component';
import { AnimeService } from '../../services/anime.service';

@Component({
  selector: 'app-add-to-list-modal',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, CreateListModalComponent],
  templateUrl: './add-to-list-modal.component.html',
  styleUrl: './add-to-list-modal.component.scss'
})
export class AddToListModalComponent {
  @Input() lists: OtakuList[] = [];
  @Input() anime: AnimeApi | undefined;
  @Output() close = new EventEmitter<void>();
  @Output() addToList = new EventEmitter<{ list: OtakuList, anime: AnimeApi }>();
  //selectedAnime: AnimeApi | null = null;
  isCreateListModalVisible: boolean = false;
  listToRename: OtakuList | null = null; 
  initialListName: string = ''; 
  selectedList: OtakuList | null = null;


  constructor(private animeService: AnimeService) { }

  getOtakuLists(){
    this.animeService.getOtakuLists().subscribe({
      next: (data: OtakuList[]) => {
        this.lists = data;
      },
      error: (error) => console.error('Error fetching otaku lists', error)
    }); 
  }


  closeModal(): void {
    this.close.emit();
  }

  confirmAdd(): void {
    if (this.selectedList) {
      console.log(this.anime, this.selectedList)
      this.addToList.emit({ list: this.selectedList, anime: this.anime! });
      this.closeModal();
    }
  }
  showCreateListModal(): void {
    this.isCreateListModalVisible = true;
  }

  closeCreateListModal(): void {
    this.isCreateListModalVisible = false;
    this.listToRename = null;
    this.initialListName = ''; 
    window.location.reload(); 
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
}
