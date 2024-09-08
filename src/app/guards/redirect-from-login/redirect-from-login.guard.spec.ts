import { TestBed } from '@angular/core/testing';

import { RedirectFromLoginGuard } from './redirect-from-login.guard';

describe('RedirectFromLoginGuard', () => {
  let guard: RedirectFromLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RedirectFromLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
