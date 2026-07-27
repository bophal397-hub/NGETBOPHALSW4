import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tailwind } from './tailwind';

describe('Tailwind', () => {
  let component: Tailwind;
  let fixture: ComponentFixture<Tailwind>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tailwind],
    }).compileComponents();

    fixture = TestBed.createComponent(Tailwind);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
