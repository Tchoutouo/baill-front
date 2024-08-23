import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsHightlightComponent } from './products-hightlight.component';

describe('ProductsHightlightComponent', () => {
  let component: ProductsHightlightComponent;
  let fixture: ComponentFixture<ProductsHightlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsHightlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsHightlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
