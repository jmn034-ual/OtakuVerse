import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToListModalComponent } from './add-to-list-modal.component';

describe('AddToListModalComponent', () => {
  let component: AddToListModalComponent;
  let fixture: ComponentFixture<AddToListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToListModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddToListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
