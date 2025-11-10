import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotosVideoComponent } from './photos-video.component';

describe('PhotosVideoComponent', () => {
  let component: PhotosVideoComponent;
  let fixture: ComponentFixture<PhotosVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotosVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
