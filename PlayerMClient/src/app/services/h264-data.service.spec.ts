import { TestBed } from '@angular/core/testing';

import { H264DataService } from './h264-data.service';

describe('H264DataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: H264DataService = TestBed.get(H264DataService);
    expect(service).toBeTruthy();
  });
});
