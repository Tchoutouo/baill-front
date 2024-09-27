import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForfaitListComponent } from './forfait-list.component';

describe('ForfaitListComponent', () => {
  let component: ForfaitListComponent;
  let fixture: ComponentFixture<ForfaitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForfaitListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForfaitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
