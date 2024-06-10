import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAnimeComponent } from './list-anime.component';

describe('ListAnimeComponent', () => {
  let component: ListAnimeComponent;
  let fixture: ComponentFixture<ListAnimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAnimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAnimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
