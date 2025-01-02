import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouceDetailsComponent } from './annouce-details.component';

describe('AnnouceDetailsComponent', () => {
  let component: AnnouceDetailsComponent;
  let fixture: ComponentFixture<AnnouceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouceDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
