import { TestBed } from '@angular/core/testing';

import { CheckProfilService } from './check-profil.service';

describe('CheckProfilService', () => {
  let service: CheckProfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckProfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
