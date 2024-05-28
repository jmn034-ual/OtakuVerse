import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AnimeDetailComponent } from './anime-detail/anime-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'anime/:id', component: AnimeDetailComponent }
];
