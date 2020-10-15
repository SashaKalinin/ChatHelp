import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import {AppModule} from '../../app.module';
import Spy = jasmine.Spy;

describe('AlertService', () => {
  let service: AlertService;
  const text = '123';
  let spy1: Spy;
  let spy2: Spy;
  let spy3: Spy;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [AlertService]
    });
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('success', () => {
    it('should alert success mess', () => {
      spy1 = spyOn(service, 'success');
      service.success(text);
      expect(spy1).toHaveBeenCalled();
    });
  });
  describe('warning', () => {
    it('should alert warning mess', () => {
      spy2 = spyOn(service, 'warning');
      service.warning(text);
      expect(spy2).toHaveBeenCalled();
    });
  });
  describe('danger', () => {
    it('should alert danger mess', () => {
      spy3 = spyOn(service, 'danger');
      service.danger(text);
      expect(spy3).toHaveBeenCalled();
    });
  });
});
