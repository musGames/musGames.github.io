import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadGame } from './upload-game';

describe('UploadGame', () => {
  let component: UploadGame;
  let fixture: ComponentFixture<UploadGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
