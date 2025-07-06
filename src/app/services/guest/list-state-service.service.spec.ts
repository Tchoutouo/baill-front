import { TestBed } from '@angular/core/testing';

import { ListStateServiceService } from './list-state-service.service';

describe('ListStateServiceService', () => {
  let service: ListStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
