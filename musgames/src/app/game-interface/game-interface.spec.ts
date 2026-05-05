import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInterface } from './game-interface';

describe('GameInterface', () => {
  let component: GameInterface;
  let fixture: ComponentFixture<GameInterface>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameInterface]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameInterface);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
