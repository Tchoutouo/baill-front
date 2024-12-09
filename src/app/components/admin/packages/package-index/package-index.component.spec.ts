import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageIndexComponent } from './package-index.component';

describe('PackageIndexComponent', () => {
  let component: PackageIndexComponent;
  let fixture: ComponentFixture<PackageIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
