import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSound } from './pro-sound.component';

describe('ProSound', () => {
  let component: ProSound;
  let fixture: ComponentFixture<ProSound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProSound]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProSound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
