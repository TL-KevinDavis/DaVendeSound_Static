import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DjPackages } from './dj-packages';

describe('DjPackages', () => {
  let component: DjPackages;
  let fixture: ComponentFixture<DjPackages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DjPackages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DjPackages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
