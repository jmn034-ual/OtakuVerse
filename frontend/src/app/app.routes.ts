import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AnimeDetailComponent } from './anime-detail/anime-detail.component';
import { ListAnimeComponent } from './list-anime/list-anime.component';
import { MyListsComponent } from './my-lists/my-lists.component';
import { MylistDetailComponent } from './mylist-detail/mylist-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'anime/:id', component: AnimeDetailComponent },
    { path: 'list/:category', component: ListAnimeComponent },
    { path: 'mylist', component: MyListsComponent },
    { path: 'mylist-detail/:id', component: MylistDetailComponent },
];
