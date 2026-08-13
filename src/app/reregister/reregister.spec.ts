import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reregister } from './reregister';

describe('Reregister', () => {
  let component: Reregister;
  let fixture: ComponentFixture<Reregister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reregister],
    }).compileComponents();

    fixture = TestBed.createComponent(Reregister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
