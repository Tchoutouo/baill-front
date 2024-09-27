import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouceIndexComponent } from './annouce-index.component';

describe('AnnouceIndexComponent', () => {
  let component: AnnouceIndexComponent;
  let fixture: ComponentFixture<AnnouceIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouceIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouceIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
