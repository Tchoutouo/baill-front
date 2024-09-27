import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForfaitItemComponent } from './forfait-item.component';

describe('ForfaitItemComponent', () => {
  let component: ForfaitItemComponent;
  let fixture: ComponentFixture<ForfaitItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForfaitItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForfaitItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
