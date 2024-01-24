import { FireVideoComponent } from './fire-video.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';


describe('JestComponent', () => {
  let component: FireVideoComponent;
  let fixture: ComponentFixture<FireVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FireVideoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FireVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
