import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-list-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-list-modal.component.html',
  styleUrl: './create-list-modal.component.scss'
})
export class CreateListModalComponent implements OnChanges{
  
  @Input() initialListName: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<string>();

  listName: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialListName'] && changes['initialListName'].currentValue) {
      this.listName = this.initialListName;
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  createList(): void {
    if (this.listName.trim()) {
      this.create.emit(this.listName);
      this.listName = '';
      this.closeModal();
    }
  }
}
