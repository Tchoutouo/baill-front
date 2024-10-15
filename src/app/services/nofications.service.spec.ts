import { TestBed } from '@angular/core/testing';

import { NoficationsService } from './nofications.service';

describe('NoficationsService', () => {
  let service: NoficationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoficationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
