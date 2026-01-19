import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMailForgotPasswordComponent } from './send-mail-forgot-password.component';

describe('SendMailForgotPasswordComponent', () => {
  let component: SendMailForgotPasswordComponent;
  let fixture: ComponentFixture<SendMailForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendMailForgotPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendMailForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
