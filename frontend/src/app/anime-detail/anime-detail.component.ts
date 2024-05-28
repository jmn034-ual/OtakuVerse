import { Component, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule


@Component({
  selector: 'app-anime-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anime-detail.component.html',
  styleUrl: './anime-detail.component.scss'
})
export class AnimeDetailComponent {
  isHovered: boolean = false;

  @HostListener('mouseenter') onMouseEnter() {
    this.isHovered = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.isHovered = false;
  }
}
